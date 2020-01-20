var express = require('express');
var router = express.Router();
const client = require('../config/clientPg')

function errorQuery(e, res) {
    res.json({
        error: `bdd request failed`
    })
    console.error(e.stack)
}

/* GET cryptos infos
 * param cmids
 */
router.get('/cryptos', function (req, res, next) {
    let query1 = "SELECT * from CRYPTO_LIST",
        values = "";
    if (req.query.cmids != undefined) {
        const cmids = req.query.cmids.split(",");
        values = `'${cmids[0]}'`
        for (let i = 1; i < cmids.length; i++)
            values += `,'${cmids[i]}'`
        query1 = `SELECT id,symbol,fullname,picture_url from CRYPTO_LIST WHERE symbol IN (${values})`
    }
    client
        .query(query1)
        .then(result1 => {
            let now = new Date()
            let a = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0, 0).getTime() / 1000
            if (result1.rows.length == 0)
                res.json({
                    error: `No crypto matches symbols '${cmids}'`
                })
            let query2 = `SELECT * from CRYPTO_HISTORY WHERE period = 'daily' AND crypto_id IN ( SELECT id FROM CRYPTO_LIST ) AND timestamp = to_timestamp(${a})`
            if (values != "")
                query2 = `SELECT * from CRYPTO_HISTORY WHERE period = 'daily' AND crypto_id IN ( SELECT id FROM CRYPTO_LIST WHERE symbol IN (${values})) AND timestamp = to_timestamp(${a})`
            client
                .query(query2)
                .then(result2 => {
                    result1.rows.forEach(elem1 => {
                        result2.rows.forEach(elem2 => {
                            if (elem1.id == elem2.crypto_id) {
                                elem1.open = elem2.open
                                elem1.high = elem2.high
                                elem1.low = elem2.low
                                elem1.close = elem2.close
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
        })
        .catch(e => errorQuery(e, res))

});


/* GET cryptos infos
 * param cmids,; period
period : daily, hourly or minute
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
                    res.json({
                        error: `No crypto matches this symbol '${cmid}'`
                    })
                else
                    res.json({
                        data: result.rows
                    })
            })
            .catch(e => errorQuery(e, res))
    } else {
        res.json({
            error: `got '${period}', period parameter must match the one of following : 'daily', 'hourly' or 'minute'`
        })
    }
});

module.exports = router;