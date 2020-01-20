var express = require('express');
var router = express.Router();
const client = require('../config/clientPg')


/* GET home page. */
router.get('/cryptos', function (req, res, next) {
    let query = "SELECT * from CRYPTO_LIST"
    if (req.query.cmids != undefined) {
        const cmids = req.query.cmids.split(",");
        let values = "'" + cmids[0] + "'"
        for (let i = 1; i < cmids.length; i++)
            values += ",'" + cmids[i] + "'"
        query = 'SELECT * from CRYPTO_LIST WHERE fullName = ' + values + ''
    }
    client
        .query(query)
        .then(result => {
            res.json({
                test: result.rows
            })
        })
        .catch(e => console.error(e.stack))
});

module.exports = router;