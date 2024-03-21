const express = require('express');
const passport = require('passport');
const { DigestStrategy } = require('passport-http');
const users = require('./credentials.json');
const session = require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: 'longsecretcode'
});

const app = express();
app.use(session);
app.use(passport.initialize());

passport.use(new DigestStrategy({ qop: 'auth' },
    (username, done) => {
        const user = users.find(u => u.username === username);
        if (user) {
            return done(null, user.username, user.password);
        } else {
            return done(null, false);
        }
    },
    (params, done) => {
        done(null, true);
    }
));

app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res, next) => {
    if (req.session.logout) {
        req.session.logout = false;
        delete req.headers['authorization'];
    }
    next();
}, passport.authenticate('digest', { session: false }))
    .get('/login', (req, res) => {
        res.redirect('/resource');
    });


app.get('/logout', (req, res) => {
    req.session.logout = true;
    res.redirect('/login');
});

app.get('/resource', passport.authenticate('digest', { session: false }), (req, res) => {
    if (req.headers['authorization'])
        res.send('RESOURCE');
    else
        res.redirect('/login');
});

app.get('*', (req, res) => {
    res.status(404).send('Сообщение со статусом 404');
});

app.listen(process.env.PORT || 3000, () =>
    console.log('http://localhost:3000')
);