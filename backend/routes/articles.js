const express = require('express');
const router = express.Router();
const client = require('../config/clientPg');

function errorQuery(e, res) {
    res.status(418).json({
        error: `bdd request failed`,
        message: `I'm a teapot`
    })
    console.error(e.stack)
}

/*
GET /articles[?params1=value1&. . . ]
*/
router.get('/articles', function (req, res, next) {
    const GET_RSS_RSS_HISTORY = "SELECT * from RSS_HISTORY";

    client
        .query(GET_RSS_RSS_HISTORY)
        .then(result => {
            res.json({
                data: result.rows
            })
        })
        .catch(e => errorQuery(e, res))
});

/*
GET /articles/:id
*/
router.get('/articles/:id', function (req, res, next) {
    const GET_RSS_HISTORY = `SELECT * from RSS_HISTORY WHERE id = ${req.params.id}`;

    client
        .query(GET_RSS_HISTORY)
        .then(result => {
            if (result.rows.length === 0)
                res.status(400).json({
                    error: `No article match id '${req.params.id}'`
                })
            else
                res.json({
                    data: result.rows[0]
                })
        })
        .catch(e => errorQuery(e, res))
});

module.exports = router;