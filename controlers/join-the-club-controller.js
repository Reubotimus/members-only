const {giveMemberPermission} = require('../db/requests');

function getJoinTheClub (req, res) {
    // console.log(req.user.member);
    if (req.user && req.user.member) { res.redirect('/') }
    else if (req.user) { res.render('join-the-club') }
    else { res.redirect('/sign-up') }
}

function postJoinTheClub(req, res, next) {
    try {
        if (req.body.code === '12345') {
            giveMemberPermission(req.user.id);
            res.redirect('/');
        } else {
            res.render('join-the-club');
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {getJoinTheClub, postJoinTheClub}