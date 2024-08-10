const express = require("express");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));
app.get('/log-in', (req, res) => res.render('log-in'));
app.get('/sign-up', (req, res) => res.render('sign-up'));

app.post('/sign-up', (req, res) => res.send('sign up failed'))
app.post('/log-in', (req, res) => res.send('log up failed'))


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('listening'));
