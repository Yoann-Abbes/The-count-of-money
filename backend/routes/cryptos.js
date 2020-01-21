var express = require('express');
var router = express.Router();
const client = require('../config/clientPg')

function errorQuery(e, res) {
    res.status(418).json({
        error: `bdd request failed`,
        message: `I'm a teapot`
    })
    console.error(e.stack)
}

/* GET cryptos infos
/cryptos?[cmids={cm}]
examples:
    - /cryptos
    - /cryptos?cmids=BTC
    - /cryptos?cmids=BTC,ETH,XRP
*/
router.get('/cryptos', function (req, res, next) {
    let query1 = "SELECT * from CRYPTO_LIST",
        values = "";
    if (req.query.cmids != undefined) {
        const cmids = req.query.cmids.split(",").map((cmid) => {
            return `'${cmid}'`
        }).join();
        query1 = `SELECT id,symbol,fullname,picture_url from CRYPTO_LIST WHERE symbol IN (${cmids})`
    }
    client
        .query(query1)
        .then(result1 => {
            let now = new Date()
            let a = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0, 0).getTime() / 1000
            if (result1.rows.length == 0)
                res.status(400).json({
                    error: `No crypto matches symbols '${cmids}'`
                })
            else {
                let query2 = `SELECT * from CRYPTO_HISTORY WHERE period = 'daily' AND crypto_id IN ( SELECT id FROM CRYPTO_LIST ) AND timestamp = to_timestamp(${a})`
                if (values != "")
                    query2 = `SELECT * from CRYPTO_HISTORY WHERE period = 'daily' AND crypto_id IN ( SELECT id FROM CRYPTO_LIST WHERE symbol IN (${values})) AND timestamp = to_timestamp(${a})`
                client
                    .query(query2)
                    .then(result2 => {
                        result1.rows.forEach(elem1 => {
                            result2.rows.forEach(elem2 => {
                                if (elem1.id == elem2.crypto_id) {
                                    elem1.openDay = elem2.open
                                    elem1.highDay = elem2.high
                                    elem1.lowDay = elem2.low
                                    elem1.closeDay = elem2.close
                                    elem1.price = elem2.price
                                    delete elem1.id
                                }
                            });
                        });
                        res.json({
                            data: result1.rows
                        })
                    })
                    .catch(e => errorQuery(e, res))
            }
        })
        .catch(e => errorQuery(e, res))
});

/* GET one crypto infos
/cryptos/{cmid}
examples:
    - /cryptos/BTC
    - /cryptos/XRP
*/
router.get('/cryptos/:cmid', function (req, res, next) {
    let cmid = req.params.cmid,
        query1 = `SELECT * from CRYPTO_LIST WHERE symbol = '${cmid}'`;
    client
        .query(query1)
        .then(result1 => {
            let now = new Date()
            let a = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0, 0).getTime() / 1000
            if (result1.rows.length == 0)
                res.status(400).json({
                    error: `No crypto matches symbols '${cmid}'`
                })
            else {
                let query2 = `SELECT * from CRYPTO_HISTORY WHERE period = 'daily' AND crypto_id IN ( SELECT id FROM CRYPTO_LIST WHERE symbol = '${cmid}' ) AND timestamp = to_timestamp(${a})`
                client
                    .query(query2)
                    .then(result2 => {
                        result1.rows.forEach(elem1 => {
                            result2.rows.forEach(elem2 => {
                                if (elem1.id == elem2.crypto_id) {
                                    elem1.openDay = elem2.open
                                    elem1.highDay = elem2.high
                                    elem1.lowDay = elem2.low
                                    elem1.closeDay = elem2.close
                                    elem1.price = elem2.price
                                    delete elem1.id
                                }
                            });
                        });
                        res.status(400).json({
                            data: result1.rows
                        })
                    })
                    .catch(e => errorQuery(e, res))
            }
        })
        .catch(e => errorQuery(e, res))
});

/* GET one crypto infos for a period
/cryptos/{cmid}/history/{period}
examples:
    - /cryptos/BTC/history/minute
    - /cryptos/XRP/history/hourly
    - /cryptos/ETH/history/daily
 */
router.get('/cryptos/:cmid/history/:period', function (req, res, next) {
    const cmid = req.params.cmid,
        period = req.params.period,
        validPeriod = ['daily', 'hourly', 'minute'];
    if (validPeriod.includes(period)) {
        let query = `SELECT period,timestamp,open,high,low,close from CRYPTO_HISTORY WHERE period = '${period}' AND crypto_id = ( SELECT id FROM CRYPTO_LIST WHERE symbol = '${cmid}' LIMIT 1 )`
        client
            .query(query)
            .then(result => {
                if (result.rows.length == 0)
                    res.status(400).json({
                        error: `No crypto matches this symbol '${cmid}'`
                    })
                else
                    res.json({
                        data: result.rows
                    })
            })
            .catch(e => errorQuery(e, res))
    } else {
        res.status(400).json({
            error: `got '${period}', period parameter must match the one of following : 'daily', 'hourly' or 'minute'`
        })
    }
});

/* POST a cryptocurrency to the platform
/cryptos
body params to give:
{
    "symbol": "WOLF",
    "fullname": "WOLF",
    "picture_url": "https://www.cryptocompare.com/media/20559/wolf.png"
}
*/
router.post('/cryptos', function (req, res, next) {
    const symbol = req.body.symbol,
        fullname = req.body.fullname,
        picture_url = req.body.picture_url;
    [null, undefined, ""].forEach(element => {
        if ([symbol, fullname, picture_url].includes(element)) {
            res.status(400).end()
            return
        }
    });

    let query1 = `SELECT * FROM CRYPTO_LIST WHERE symbol = '${symbol}'`;
    client
        .query(query1)
        .then(result => {
            if (result.rows.length == 0) {
                let query2 = `INSERT INTO CRYPTO_LIST (symbol, fullname, picture_url) VALUES ('${symbol}', '${fullname}', '${picture_url}')`;
                client
                    .query(query2)
                    .then(result2 => {
                        res.sendStatus(200)
                    })
                    .catch(e => errorQuery(e, res))
            } else {
                res.status(400).json({
                    error: `crypto '${symbol}' already added`
                })
            }
        })
        .catch(e => errorQuery(e, res))
});

/* DELETE a cryptocurrency of the platform
/cryptos/{cmid}
examples:
    - /cryptos/BTC
    - /cryptos/ETH
*/
router.delete('/cryptos/:cmid', function (req, res, next) {
    const cmid = req.params.cmid,
        query = `DELETE FROM CRYPTO_LIST WHERE symbol = '${cmid}'`;
    client
        .query(query)
        .then(result => {
            res.sendStatus(200)
        })
        .catch(e => errorQuery(e, res))
});

module.exports = router;