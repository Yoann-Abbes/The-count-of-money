const express = require('express');
let path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cryptoRouter = require('./routes/cryptos');
const userRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const swaggerDoc = require('./swaggerDoc');

let app = express();

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
