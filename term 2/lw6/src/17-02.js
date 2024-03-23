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

// Подключение модели USERS
const USERS = require('./database/models/Users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const ACCESS_TOKEN_SECRET = 'your_access_token_secret';
const REFRESH_TOKEN_SECRET = 'your_refresh_token_secret';

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

        // Создание и сохранение токенов в Redis вместо использования объекта
        redisClient.set(refreshToken, 24 * 60 * 60, username); // Сохраняем refreshToken на 24 часа

        refreshTokens[refreshToken] = user.username;
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

app.get('/refresh-token', (req, res) => {
    console.log("🟦🟦🟦  get:refresh-token");
    const refreshToken = req.cookies.refreshToken;
    redisClient.get(refreshToken, (err, result) => {
        if (err || !result) return res.sendStatus(401);

        const user = JSON.parse(result);

        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);

            const newAccessToken = jwt.sign({ userId: user.userId, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
            const newRefreshToken = jwt.sign({ userId: user.userId, username: user.username }, REFRESH_TOKEN_SECRET, { expiresIn: '24h' });

            // Удаление старого Refresh токена из Redis и сохранение нового
            redisClient.del(refreshToken, (delErr) => {
                if (delErr) return res.status(500).send('Internal Server Error');

                redisClient.set(newRefreshToken, JSON.stringify(user), 'EX', 24 * 60 * 60, (setErr) => {
                    if (setErr) return res.status(500).send('Internal Server Error');

                    res.cookie('accessToken', newAccessToken, { httpOnly: true, sameSite: 'Strict' });
                    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'Strict', path: '/refresh-token' });

                    res.send('Токены обновлены');
                });
            });
        });
    });
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
    console.log(`Сервер запущен на порту ${port}`);
});