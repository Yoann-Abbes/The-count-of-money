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
  POST /users/register
*/
router.post('/users/login', function (req, res, next) {
    const email = req.body.email,
        password = req.body.password,
        username = req.body.username;
    [null, undefined, ""].forEach(element => {
        if ([symbol, fullname, picture_url].includes(element)) {
            res.sendStatus(400)
            return
        }
    });


    let query1 = "SELECT * FROM USERS";
    client
        .query(query1)
        .then(result1 => {
            result1.rows.forEach(element => {
                if (element.email == email) {
                    res.status(400).json({
                        error: "email already taken"
                    })
                    return
                }
                // TODO demain
                let query2 = `INSERT INTO CRYPTO_LIST (email, password, username, is_admin) VALUES ('${email}', '${password}', '${username}', 'false')`
                client
                    .query(query2)
                    .then(result2 => {
                        res.json({
                            data: result.rows
                        })
                    })
                    .catch(e => errorQuery(e, res))
            })
            res.json({
                data: result1.rows
            })
        })
        .catch(e => errorQuery(e, res))
});

/* GET users listing. */
router.get('/users/login', function (req, res, next) {
    // TODO demain
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
