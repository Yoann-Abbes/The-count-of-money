const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cryptoRouter = require('./routes/cryptos');
const userRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const rssRouter = require('./routes/rss');

const swaggerDoc = require('./swaggerDoc');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Authorization, JWT, Uid");
    next();
});
app.use('/', cryptoRouter);
app.use('/', userRouter);
app.use('/', articlesRouter);
app.use('/', rssRouter);
swaggerDoc(app);

module.exports = app;
