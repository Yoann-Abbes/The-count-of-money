const express = require('express');
const router = express.Router();
const client = require('../config/clientPg')

function errorQuery(e, res) {
    res.status(418).json({
        error: `bdd request failed`,
        message: `I'm a teapot`
    })
    console.error(e.stack)
}

/*
GET /rss/
get list of all rss url and name
*/
router.get('/rss', function (req, res, next) {
    const GET_RSS_LIST = `SELECT * from RSS_LIST`;

    client
        .query(GET_RSS_LIST)
        .then(result => {
            res.json({
                data: result.rows
            })
        })
        .catch(e => errorQuery(e, res))
});

/*
POST /rss/
{
    link : 'https://example.com/feed',
    name : 'bitcoin'
}

adding a new rss to the global list
*/
router.post('/rss', function (req, res, next) {
    const link = req.body.link,
        name = req.body.name,
        GET_RSS_LIST = `SELECT * from RSS_LIST`,
        INSERT_RSS = `INSERT INTO RSS_LIST (link, name) VALUES ('${link}', '${name}') `;
    [null, undefined, ""].forEach(element => {
        if ([link, name].includes(element))
            return res.status(400).json({
                error: "require body params { link : 'https://example.com/feed', name : 'bitcoin'}"
            })
    });

    client
        .query(GET_RSS_LIST)
        .then(result1 => {
            for (let i = 0; i < result1.rows.length; i++) {
                if (result1.rows[i].link === link)
                    return res.status(400).json({
                        error: "link is alredy used"
                    })
                else if (result1.rows[i].name === name)
                    return res.status(400).json({
                        error: "name is alredy used"
                    })
            }
            client
                .query(INSERT_RSS)
                .then(result2 => {
                    res.sendStatus(200)
                })
                .catch(e => errorQuery(e, res))
        })
        .catch(e => errorQuery(e, res))
});

/*
DELETE /rss/:id
example : /rss/4
delete rss from the global list
*/
router.delete('/rss/:id', function (req, res, next) {
    const GET_RSS_LIST = `SELECT * from RSS_LIST WHERE id = ${req.params.id}`,
        DEL_RSS_HISTORY = `DELETE FROM RSS_HISTORY WHERE rss_list_id = ${req.params.id}`,
        DEL_RSS_LIST = `DELETE FROM RSS_LIST WHERE id = ${req.params.id}`;

    client
        .query(GET_RSS_LIST)
        .then(result1 => {
            if (result1.rows.length === 0)
                return res.status(400).json({
                    error: `no rss id match with given value '${req.params.id}`
                })
            client
                .query(DEL_RSS_HISTORY)
                .then(result2 => {
                    client
                    .query(DEL_RSS_LIST)
                    .then(result3 => {
                        res.sendStatus(200)                  
                    })
                    .catch(e => errorQuery(e, res))
                })
                .catch(e => errorQuery(e, res))
        })
        .catch(e => errorQuery(e, res))
});

module.exports = router;
