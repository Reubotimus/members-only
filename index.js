require('dotenv').config()
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const {obtainUserWithUsername, obtainUserWithId} = require('./db/requests')
const bcrypt = require('bcryptjs');
const indexRouter = require('./routers/indexRouter');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ secret: "cats", resave: false, saveUninitialized: false, cookie: {maxAge: 3600000 * 24}}));
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
app.use('/', indexRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('listening'));
