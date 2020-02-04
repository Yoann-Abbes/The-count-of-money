const express = require('express');
const router = express.Router();
const client = require('../config/clientPg');
const authentication = require('../middleware/authentication');

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
router.get('/cryptos', async (req, res, next) => {
    let GET_CRYPTO_LIST = "SELECT * from CRYPTO_LIST",
        values = "", cryptoList, cryptoHistoryByDay;
    if (req.query && req.query.cmids) {
        const cmids = req.query.cmids.split(",").map(e => `'${e}'`).join();
        GET_CRYPTO_LIST = `SELECT id,symbol,fullname,picture_url from CRYPTO_LIST WHERE symbol IN (${cmids})`
    }
    try {
        cryptoList = await client.query(GET_CRYPTO_LIST);
    } catch (error) {
        console.log(error.message);
        errorQuery(error, res)
    }

    const now = new Date()
    let a = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0, 0).getTime() / 1000
    let GET_CRYPTO_HISTORY_BY_DAY_AND_ID = `SELECT * from CRYPTO_HISTORY WHERE period = 'daily' AND crypto_id IN ( SELECT id FROM CRYPTO_LIST ) AND timestamp = to_timestamp(${a})`
    if (values !== "")
        GET_CRYPTO_HISTORY_BY_DAY_AND_ID = `SELECT * from CRYPTO_HISTORY WHERE period = 'daily' AND crypto_id IN ( SELECT id FROM CRYPTO_LIST WHERE symbol IN (${values})) AND timestamp = to_timestamp(${a})`
    try {
        cryptoHistoryByDay = await client.query(GET_CRYPTO_HISTORY_BY_DAY_AND_ID);
    } catch (error) {
        console.log(error.message);
        errorQuery(error, res)
    }
    const data = cryptoList.rows.map(crypto => {
        let history = cryptoHistoryByDay.rows.find(c => c.crypto_id === crypto.id.toString());
        crypto.openDay = history.open
        crypto.highDay = history.high
        crypto.lowDay = history.low
        crypto.closeDay = history.close
        crypto.price = history.price
        return crypto
    });
    res.json({
        data: data
    })
});

/* GET one crypto infos
/cryptos/{cmid}
examples:
    - /cryptos/BTC
    - /cryptos/XRP
*/
router.get('/cryptos/:cmid', authentication.isNotAnonymous, function (req, res, next) {
    const cmid = req.params.cmid,
        GET_CRYPTO_WHERE_SYMBOL = `SELECT * from CRYPTO_LIST WHERE symbol = '${cmid}'`;
    client
        .query(GET_CRYPTO_WHERE_SYMBOL)
        .then(result1 => {
            let now = new Date()
            let a = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0, 0).getTime() / 1000
            if (result1.rows.length === 0)
                res.status(400).json({
                    error: `No crypto matches symbols '${cmid}'`
                })
            else {
                let GET_CRYPTO_DAY_INFO_BY_LIST_ID = `SELECT * from CRYPTO_HISTORY WHERE period = 'daily' AND crypto_id IN ( SELECT id FROM CRYPTO_LIST WHERE symbol = '${cmid}' ) AND timestamp = to_timestamp(${a})`
                client
                    .query(GET_CRYPTO_DAY_INFO_BY_LIST_ID)
                    .then(result2 => {
                        result1.rows.forEach(elem1 => {
                            result2.rows.forEach(elem2 => {
                                if (elem1.id === elem2.crypto_id) {
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
router.get('/cryptos/:cmid/history/:period', authentication.isNotAnonymous, function (req, res, next) {
    const cmid = req.params.cmid,
        period = req.params.period,
        validPeriod = ['daily', 'hourly', 'minute'];
    if (validPeriod.includes(period)) {
        let GET_CRYPTO_HISTORY_BY_PERIOD = `SELECT period,timestamp,open,high,low,close from CRYPTO_HISTORY WHERE period = '${period}' AND crypto_id = ( SELECT id FROM CRYPTO_LIST WHERE symbol = '${cmid}' LIMIT 1 )`
        client
            .query(GET_CRYPTO_HISTORY_BY_PERIOD)
            .then(result => {
                if (result.rows.length === 0)
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
router.post('/cryptos', authentication.isAdmin, function (req, res, next) {
    const symbol = req.body.symbol,
        fullname = req.body.fullname,
        picture_url = req.body.picture_url;
    [null, undefined, ""].forEach(element => {
        if ([symbol, fullname, picture_url].includes(element)) {
            res.status(400).end()
            return
        }
    });

    let GET_CRYPTO_HISTORY_BY_ID = `SELECT * FROM CRYPTO_LIST WHERE symbol = '${symbol}'`;
    client
        .query(GET_CRYPTO_HISTORY_BY_ID)
        .then(result => {
            if (result.rows.length === 0) {
                let INSERT_NEW_CRYPTO = `INSERT INTO CRYPTO_LIST (symbol, fullname, picture_url) VALUES ('${symbol}', '${fullname}', '${picture_url}')`;
                client
                    .query(INSERT_NEW_CRYPTO)
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
router.delete('/cryptos/:cmid', authentication.isAdmin, function (req, res, next) {
    const cmid = req.params.cmid,
        GET_CRYPTO_BY_ID = `SELECT id FROM CRYPTO_LIST WHERE symbol = '${cmid}'`,
        id_list = new Set();

    client
        .query(GET_CRYPTO_BY_ID)
        .then(result1 => {
            if (result1.rows.length === 0) {
                res.status(400).json({
                    error: "Crypto don't exist"
                })
                return
            }
            result1.rows.forEach(elem => {
                id_list.add(elem.id)
            })
            id_list.forEach(id => {
                const DELETE_CRYPTO_HISTORY_BY_CRYPTO_ID = `DELETE FROM CRYPTO_HISTORY WHERE crypto_id = '${id}'`,
                    DELETE_CRYPTO = `DELETE FROM CRYPTO_LIST WHERE symbol = '${cmid}'`;
                client
                    .query(DELETE_CRYPTO_HISTORY_BY_CRYPTO_ID)
                    .then(result2 => {
                        client
                            .query(DELETE_CRYPTO)
                            .then(result3 => {
                                res.sendStatus(200)
                            })
                            .catch(e => errorQuery(e, res))
                    })
                    .catch(e => errorQuery(e, res))
            })
        })
        .catch(e => errorQuery(e, res))

});

module.exports = router;