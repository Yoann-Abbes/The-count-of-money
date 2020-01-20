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

/* GET users listing. */
router.get('/users/login', function (req, res, next) {
  let query = "SELECT * FROM USERS";
  client
  .query(query)
  .then(result => {
      res.json({
          data: result.rows
      })
  })
  .catch(e => errorQuery(e, res))
});

module.exports = router;