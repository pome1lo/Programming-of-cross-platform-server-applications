const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const app = express();
const port = 3000;
app.use(express.static('public'));


app.use(session({
    secret: 'ASaDSS54AA-SD5SASDAS-F8ASDxaca-8wASD84AASD5_SAd5asd5as-S9ASDD874s',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));


app.use(passport.initialize());
app.use(passport.session());

const googleParams = JSON.parse(fs.readFileSync('google_params.json', 'utf8')).params;


passport.use(new GoogleStrategy({
        clientID: googleParams.clientID,
        clientSecret: googleParams.clientSecret,
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, cb) {
        // связать профиль юзера с бд
        return cb(null, profile);
    }
));


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});



app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/resource');
    }
);

app.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

app.get('/resource', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`RESOURCE: ${req.user}`);
    } else {
        res.redirect('/login');
        console.log("📛📛📛\tНЕТ ПРАВ !");
    }
});

app.use((req, res) => {
    res.status(404).send('404: Страница не найдена');
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
