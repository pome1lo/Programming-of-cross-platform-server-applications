const express = require('express');
const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const users = require('./credentials.json');
const session = require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: 'longsecretcode'
});

const app = express();
app.use(session);
app.use(passport.initialize());

passport.use(new BasicStrategy(
    (username, password, done) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }
));

const auth = passport.authenticate('basic', { session: false });

app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res, next) => {
    if (req.session.logout) {
        req.session.logout = false;
        delete req.headers['authorization'];
    }
    next();
}, passport.authenticate('basic', { session: false }))
    .get('/login', (req, res) => {
        res.redirect('/resource');
    });

app.get('/logout', (req, res) => {
    req.session.logout = true;
    res.redirect('/login');
});

app.get('/resource', (req, res) => {
    if (req.headers['authorization'])
        res.send('RESOURCE');
    else
        res.redirect('/login');
});

app.get('*', (req, res) => {
    res.status(404).send('Сообщение со статусом 404 ');
});

app.listen(process.env.PORT || 3000, () =>
    console.log(`http://localhost:3000`)
);
