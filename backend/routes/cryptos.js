const express = require('express');
const router = express.Router();
const client = require('../config/clientPg');
const authentication = require('../middleware/authentication');
const axios = require('axios')
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
    let a = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime() / 1000
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
            let a = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime() / 1000
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
router.post('/cryptos', authentication.isAdmin, async (req, res, next) => {
    const symbol = req.body.symbol;
    [null, undefined, ""].forEach(element => {
        if ([symbol].includes(element)) {
            res.status(400).end()
            return
        }
    });
    
    const coinListUrl = `https://min-api.cryptocompare.com/data/all/coinlist`;
    const cryptoListResponse = await axios.get(coinListUrl);

    if (!cryptoListResponse.data.Data[symbol]) {
        res.status(400).json({
            error: `The'${symbol}' crypto isn't available`
        })
    }
    
    const picture_url = `https://www.cryptocompare.com/${cryptoListResponse.data.Data[symbol].ImageUrl}`;
    const fullname = cryptoListResponse.data.Data[symbol].CoinName;
    

    let GET_CRYPTO_HISTORY_BY_ID = `SELECT * FROM CRYPTO_LIST WHERE symbol = '${symbol}'`;
    try {
        const result = await client.query(GET_CRYPTO_HISTORY_BY_ID)
        if (result.rows.length === 0) {
            let INSERT_NEW_CRYPTO = `INSERT INTO CRYPTO_LIST (symbol, fullname, picture_url) VALUES ('${symbol}', '${fullname}', '${picture_url}')`;
            try {
                await client.query(INSERT_NEW_CRYPTO)
            } catch (error) {
                errorQuery(error, res)
            }
        } else {
            res.status(400).json({
                error: `crypto '${symbol}' already added`
            })
        }
    } catch (error) {
        errorQuery(error, res)
    }

    try {
    const getId = await client.query(`SELECT * FROM CRYPTO_LIST WHERE symbol = '${symbol}';`)
    const id = getId.rows[0].id

    const APIKEY = 'd9a6b09f786d982185dbd38590dca29de06be1e5239482bbba0b249241948838'
    let cryptoQuery = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';
    const cryptoDaysUrl = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=EUR&limit=60&api_key=${APIKEY}`;
    const cryptoHoursUrl = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=EUR&limit=48&api_key=${APIKEY}`;
    const cryptoMinutsUrl = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${symbol}&tsym=EUR&limit=120&api_key=${APIKEY}`;

    const cryptoDaysResponse = await axios.get(cryptoDaysUrl);
    const days = cryptoDaysResponse.data.Data.Data;
    for (const day of days) {
        cryptoQuery += `('${id}', 'daily', to_timestamp(${day.time}), '${day.open}', '${day.high}', '${day.low}', '${day.close}'),\n`;
    }
    const cryptoHoursResponse = await axios.get(cryptoHoursUrl);
    const hours = cryptoHoursResponse.data.Data.Data;
    for (const hour of hours) {
        cryptoQuery += `('${id}', 'hourly', to_timestamp(${hour.time}), '${hour.open}', '${hour.high}', '${hour.low}', '${hour.close}'),\n`;
    }
    const cryptoMinutsResponse = await axios.get(cryptoMinutsUrl);
    const minutes = cryptoMinutsResponse.data.Data.Data;
    for (const minute of minutes) {
        cryptoQuery += `('${id}', 'minute', to_timestamp(${minute.time}), '${minute.open}', '${minute.high}', '${minute.low}', '${minute.close}'),\n`;
    }
    cryptoQuery = cryptoQuery.slice(0, -2);
    cryptoQuery += ';';
    await client.query(cryptoQuery)
    res.sendStatus(200)
    } catch (error) {
        errorQuery(error, res)   
    }
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