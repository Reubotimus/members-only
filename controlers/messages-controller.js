
const {obtainMessages, addMessage} = require('../db/requests');

async function getMessages(req, res) {
    const messages = await obtainMessages();
    res.render('index', {messages: messages});
}

async function postMessages(req, res) {
    if (req.user && req.user.member && req.body.message) {
        await addMessage(req.user.id, req.body.message);
    } else {console.error("error occured trying to post message")}
    res.redirect('/')
}

module.exports = {getMessages, postMessages}