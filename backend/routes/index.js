var express = require('express');
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

module.exports = router;