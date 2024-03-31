const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const redis = require('redis');
const redisClient = redis.createClient("redis://127.0.0.1:6379");
redisClient.connect();
redisClient.on('error', function(error) {console.error('❌ Ошибка:', error);});
redisClient.on('connect', async function() {console.log('✅  Подключено к серверу Redis');});

const app = express();
const port = 3000;

const USERS = require('./database/models/Users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const ACCESS_TOKEN_SECRET = 'ACCESS_TOKEN_SECRET';
const REFRESH_TOKEN_SECRET = 'REFRESH_TOKEN_SECRET';

let refreshTokens = {};

app.get('/login', (req, res) => {
    console.log("🟦🟦🟦  get:login");
    res.send('<form action="/login" method="post"><h3>../login</h3><div><label>Username:</label><input type="text" name="username"/></div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Log In"/></div></form>');
});

app.post('/login', async (req, res) => {
    console.log("🟦🟦🟦  post:login");
    try {
        const { username, password } = req.body;
        const user = await USERS.findOne({ where: { username } });

        if (!user) {
            return res.status(401).redirect('/login');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).redirect('/login');
        }

        const accessToken = jwt.sign({ userId: user.id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
        const refreshToken = jwt.sign({ userId: user.id, username: user.username }, REFRESH_TOKEN_SECRET, { expiresIn: '24h' });

        // Сохранение refreshToken в Redis с TTL (24 часа)
        redisClient.set(refreshToken, 24 * 60 * 60, username); // Используем setex для установки TTL

        // Удаление строки ниже, так как теперь мы используем Redis для хранения refresh токенов
        // refreshTokens[refreshToken] = user.username;

        res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'Strict' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'Strict', path: '/refresh-token' });
        res.redirect('/resource');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/register', (req, res) => {
    console.log("🟦🟦🟦  get:register");
    res.send('<form action="/register" method="post"><h3>../register</h3><div><label>Username:</label><input type="text" name="username"/></div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Register"/></div></form>');
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Проверка, существует ли уже пользователь с таким именем
        const existingUser = await USERS.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).send('Пользователь с таким именем уже существует.');
        }

        // Хеширование пароля перед сохранением в базу данных
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание нового пользователя
        const newUser = await USERS.create({
            username,
            password: hashedPassword
        });

        res.status(201).send('Пользователь успешно зарегистрирован.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/refresh-token', async (req, res) => {
    console.log("🟦🟦🟦  get:refresh-token");
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401); // Нет refresh токена в куки
    }

    try {
        const result = await redisClient.get(refreshToken);
        if (!result) {
            return res.sendStatus(401); // Токен не найден в Redis
        }

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        // Токен валиден, создаем новые токены
        const newAccessToken = jwt.sign({ userId: decoded.userId, username: decoded.username }, ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
        const newRefreshToken = jwt.sign({ userId: decoded.userId, username: decoded.username }, REFRESH_TOKEN_SECRET, { expiresIn: '24h' });

        // Удаляем старый Refresh токен из Redis и сохраняем новый
        await redisClient.del(refreshToken);
        // Используйте 'EX' для указания TTL в секундах
        await redisClient.set(newRefreshToken, JSON.stringify({ userId: decoded.userId, username: decoded.username }), 'EX', 24 * 60 * 60);

        res.cookie('accessToken', newAccessToken, { httpOnly: true, sameSite: 'Strict' });
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'Strict', path: '/refresh-token' });

        res.send('Токены обновлены');
    } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
        if (error.name === 'TokenExpiredError') {
            res.status(401).send('Refresh token expired');
        } else {
            res.status(401).send('Invalid refresh token');
        }
    }
});



app.get('/logout', (req, res) => {
    console.log("🟦🟦🟦  get:logout");
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        // Удаляем refreshToken из Redis только если он существует
        redisClient.del(refreshToken, (err, reply) => {
            if (err) {
                console.error('Ошибка при удалении токена из Redis:', err);
            } else {
                console.log('Токен удален из Redis:', reply);
            }
        });
    } else {
        console.log('Refresh token не найден или уже удален.');
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.redirect('/login');
});

app.get('/resource', (req, res) => {
    console.log("🟦🟦🟦  get:resource");
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(401).send('Доступ запрещен');
    }

    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        res.send(`RESOURCE: Добро пожаловать, ${user.username}`);
    });
});

app.use((req, res) => {
    console.log("🟦🟦🟦  other...");
    res.status(404).send('404 Not Found');
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
 
