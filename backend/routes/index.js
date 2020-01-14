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

const clients = new Set();

router.ws('/getCurrency', function (ws, req) {
    console.log();
    
    clients.add(ws);
    ws.on('close', () => {
        clients.delete(ws)
    });

    ws.on('message', (msg) => {
        console.log('lol');
    });
});

router.ws('/refreshCurrency', function (ws, req) {
    ws.on('message', (msg) => {
        console.log('lol');
        clients.forEach(function each(client) {
            client.send(msg);
        });
    });
});


module.exports = router;