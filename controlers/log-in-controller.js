const passport = require('passport');

function getLogIn(req, res) {
    if (req.user) {
        res.redirect('/')
    } else {
        res.render('log-in')
    }
}
function postLogIn(req, res, next) { 
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/log-in');
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect('/');
        });
    }) (req, res)
}


module.exports = {getLogIn, postLogIn}