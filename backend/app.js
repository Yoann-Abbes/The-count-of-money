var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cryptoRouter = require('./routes/cryptos');
var userRouter = require('./routes/users');
var articlesRouter = require('./routes/articles');
const swaggerDoc = require('./swaggerDoc');

var app = express();

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
swaggerDoc(app);

module.exports = app;