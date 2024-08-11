const express = require('express')
const {postSignUp, getSignUp} = require("../controlers/sign-up-controller");
const {getLogIn, postLogIn} = require('../controlers/log-in-controller');
const {getJoinTheClub, postJoinTheClub} = require('../controlers/join-the-club-controller');
const passport = require("passport");

const router = express.Router();

router.get ('/', (req, res) => res.render('index'));
router.get ('/log-in', getLogIn);
router.post('/log-in', postLogIn);
router.get ('/sign-up', getSignUp);
router.post('/sign-up', postSignUp);
router.get ('/join-the-club', getJoinTheClub);
router.post('/join-the-club', postJoinTheClub)



module.exports = router;