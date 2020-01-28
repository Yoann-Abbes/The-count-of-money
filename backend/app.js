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

app.use('/', cryptoRouter);
app.use('/', userRouter);
app.use('/', articlesRouter);
app.use('/', rssRouter);
swaggerDoc(app);

module.exports = app;
