var express = require('express');
var expressWs = require('express-ws')(express);
var router = express.Router();
const client = require('../config/clientPg')


let query = 'select * from CRYPTO_LIST'
/* GET home page. */
router.get('/', function (req, res, next) {
    client
        .query(query)
        .then(result => {
            res.json({
                role: "anomyme",
                test: result.rows
            })
        })
        .catch(e => console.error(e.stack))
});

router.get('/', function (req, res, next) {
    client
        .query(query)
        .then(result => {
            res.json({
                role: "anomyme",
                test: result.rows
            })
        })
        .catch(e => console.error(e.stack))
});

router.ws('/ws', function (ws, req) {
    console.log("Server: opening ws");
    // ws.send(JSON.stringify({
    //     name: "bitcoin",
    //     n: "BTC"
    // }));

    ws.on('message', function (msg) {
        console.log(expressWs.getWss().clients)
        console.log(expressWs.getWss("/ws").clients.forEach)
        expressWs.getWss().clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    name: "bitcoin",
                    n: "BTC"
                }));
            }
        });


        // console.log("server")
        // ws.send(JSON.stringify({
        //     name: "bitcoin",
        //     n: "BTC"
        // }));
    });
});

module.exports = router;