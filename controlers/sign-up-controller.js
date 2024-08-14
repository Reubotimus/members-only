const bcrypt = require("bcryptjs");
const {obtainUserWithUsername, addUser} = require('../db/requests');
const { body, validationResult } = require("express-validator");

async function isValidUsername(req, res, next) {
    const user = obtainUserWithUsername(req.body.username);
    if (username == undefined) {next()}

}

function postEndpoint(req, res, next) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            // if err, do something
            if (err) {next(err);}
            else {
                // otherwise, store hashedPassword in DB
                try {
                    await addUser(req.body.username, hashedPassword)
                    res.redirect('/');
                } catch(err) {
                    next(err)
                }
            }
        });
    } else {
        res.redirect(
            '/sign-up?errors=' + encodeURIComponent(JSON.stringify(errors.array())) + 
            '&data=' + encodeURIComponent(JSON.stringify(req.body)));
    }
}

const postSignUp = [
    body('username', 'please enter a username').notEmpty(),
    body('username', 'sorry this username has already been taken')
        .custom(async username => {
            const user = await obtainUserWithUsername(username);
            if (user) {
                throw new error('sorry this username has already been taken')
            }
            return true;
        })
        .withMessage('Sorry, username has already been taken'),
    body('password', 'please enter a password between 5 and 30 characters long')
        .isLength(5, 30),
    body('confirm-password', 'password does not match')
        .custom(async (confirmation, {req}) => {
            if (confirmation !== req.body.password) {
                throw new error('passwords do not match');
            }
            return true;
        })
        .withMessage('passwords do not match'),
    postEndpoint
]


function getSignUp(req, res) {
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
}

module.exports = {postSignUp, getSignUp}