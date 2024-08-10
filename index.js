const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const post_sign_up = require("./controlers/sign-up-controller");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));
app.get('/log-in', (req, res) => res.render('log-in'));
app.get('/sign-up', (req, res) => {
    if (Object.keys(req.query).length == 0) {
        console.log("here")
        res.render('sign-up', {errors: [], data: {}})
    } else {
        res.render('sign-up', {
            errors: JSON.parse(decodeURIComponent(req.query.errors)), 
            data: JSON.parse(decodeURIComponent(req.query.data))
        });
    }
});

app.post('/sign-up', post_sign_up);
app.post('/log-in', (req, res) => res.send('log up failed'))


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('listening'));
