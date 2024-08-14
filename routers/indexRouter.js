const express = require('express')
const {postSignUp, getSignUp} = require("../controlers/sign-up-controller");
const {getLogIn, postLogIn, logOut} = require('../controlers/log-in-controller');
const {getJoinTheClub, postJoinTheClub} = require('../controlers/join-the-club-controller');
const {getMessages, postMessages} = require('../controlers/messages-controller');
const passport = require("passport");

const router = express.Router();

router.get ('/', getMessages);
router.post('/', postMessages);
router.get ('/log-in', getLogIn);
router.post('/log-in', postLogIn);
router.get ('/log-out', logOut);
router.get ('/sign-up', getSignUp);
router.post('/sign-up', postSignUp);
router.get ('/join-the-club', getJoinTheClub);
router.post('/join-the-club', postJoinTheClub)



module.exports = router;