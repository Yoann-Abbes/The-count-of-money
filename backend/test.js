var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

const cron = require("node-cron");

app.ws('/ws', function (ws, req) {
    // console.log("Server: opening ws");
    // ws.send(JSON.stringify({
    //     name: "bitcoin",
    //     n: "BTC"
    // }));
    var task = cron.schedule("*/2 * * * * *", function () {

        console.log(ws._receiver.writable)
        if (ws._receiver.writable)
            ws.send(JSON.stringify({
                name: "bitcoin",
                n: "BTC"
            }));
        else
            task.stop();
    });
});

cron.schedule("*/1 * * * * *", function () {
    console.log("fetching database info")
});
app.listen(5005);

// app.use(function (req, res, next) {
//     console.log('middleware');
//     req.testing = 'testing';
//     return next();
// });

// app.get('/', function (req, res, next) {
//     console.log('get route', req.testing);
//     res.end();
// });

