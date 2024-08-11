const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const {obtainUserWithUsername, obtainUserWithId} = require('./db/requests')
const bcrypt = require('bcryptjs');

const post_sign_up = require("./controlers/sign-up-controller");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await obtainUserWithUsername(username)

            if (!user) {
                console.log('user not found')
                return done(null, false, { message: "Incorrect username" });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                // passwords do not match!
                console.log('invalid password')
                return done(null, false, { message: "Incorrect password" })
            }
            return done(null, user);
            } 
        catch(err) {
            console.log('some kind of error')
            return done(err);
        }
    })
);
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await obtainUserWithId(id);
        if (!user) {
            console.log(`User with id ${id} not found`);
            return done(new Error('User not found'), null);
        }
        done(null, user);
    } catch(err) {
        console.error('Error during deserialization:', err);
        done(err, null);
    }
});

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});



app.get('/', (req, res) => res.render('index'));
app.get('/log-in', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        res.render('log-in')
    }
});
app.get('/sign-up', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else if (Object.keys(req.query).length == 0) {
        res.render('sign-up', {errors: [], data: {}})
    } else {
        res.render('sign-up', {
            errors: JSON.parse(decodeURIComponent(req.query.errors)), 
            data: JSON.parse(decodeURIComponent(req.query.data))
        });
    }
});

app.post('/sign-up', post_sign_up);
app.post('/log-in', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/log-in');
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect('/');
        });
    })(req, res, next);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('listening'));
