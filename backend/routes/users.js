const express = require('express');
const router = express.Router();
const client = require('../config/clientPg')
const jwt = require('jsonwebtoken');
const authentication = require('../middleware/authentication');

function errorQuery(e, res) {
    res.status(418).json({
        error: `bdd request failed`,
        message: `I'm a teapot`
    })
    console.error(e.stack)
}

/*
POST /users/register
    body to send:
    {
        "email": "example.mail@gmail.com",
        "username": "pseudo",
        "password": "testmdp"
    }
*/
router.post('/users/register', function (req, res, next) {
    const email = req.body.email,
        password = req.body.password,
        username = req.body.username,
        badValues = [null, undefined, ""];
    for (let i = 0; i < badValues.length; i++)
        if ([email, password, username].includes(badValues[i])) {
            res.status(400).json({
                error: "bad query params"
            });
            return
        }
    const GET_ALL_USERS = "SELECT * FROM USERS";
    client
        .query(GET_ALL_USERS)
        .then(result1 => {
            for (let i = 0; i < result1.rows.length; i++)
                if (result1.rows[i].email === email) {
                    res.status(400).json({
                        error: "email already taken"
                    })
                    return
                }
            let INSERT_USER = `INSERT INTO USERS (email, password, username, is_admin) VALUES ('${email}', '${password}', '${username}', 'false')`
            client
                .query(INSERT_USER)
                .then(result2 => {
                    res.status(200).send("OK").end()
                })
                .catch(e => errorQuery(e, res))
        })
        .catch(e => errorQuery(e, res))
});

/*
GET /users/login?email=emailValue&password=passValue
mandatory query params:
    - email
    - password
optional query params:
    /
*/
router.get('/users/login', authentication.isAnonymous, function (req, res, next) {
    const email = req.query.email,
        password = req.query.password,
        badValues = [null, undefined, ""];
    for (let i = 0; i < badValues.length; i++)
        if ([email, password].includes(badValues[i])) {
            res.status(400).json({
                error: "Bad query params"
            });
            return
        }

    const GET_ALL_USERS = "SELECT * FROM USERS";
    client
        .query(GET_ALL_USERS)
        .then(result => {
            for (let i = 0; i < result.rows.length; i++) {
                const user = result.rows[i];
                if (user.email === email && user.password === password) {
                    const token = jwt.sign({_id: user.id, _isAdmin: user.is_admin }, process.env.JWT_KEY, { expiresIn: '1d'});
                    res.header({
                        JWT: token
                    }).sendStatus(200)
                    return
                }
            }
            res.status(400).json({
                error: "Bad credentials"
            })
        })
        .catch(e => errorQuery(e, res))
});

/*
POST /users/logout
*/
router.post('/users/logout', authentication.isNotAnonymous, function (req, res, next) {
    res.sendStatus(200);
});

/*
GET /users/profile
*/
router.get('/users/profile', authentication.isNotAnonymous, function (req, res, next) {
    let id = authentication.idUserRecovered(req);
    let GET_USERS_WHERE_ID = `SELECT * FROM USERS WHERE id = '${id}' LIMIT 1`;
    client
        .query(GET_USERS_WHERE_ID)
        .then(result => {
            delete result.rows[0].id
            delete result.rows[0].is_admin
            res.status(200).json(result.rows[0])
        })
        .catch(e => errorQuery(e, res))
});

/*
PUT /users/profile
*/
router.put('/users/profile', authentication.isNotAnonymous, function (req, res, next) {
    let id = authentication.idUserRecovered(req);
    const params = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            picture_url: req.body.picture_url,
            keyword: req.body.keyword,
            favorites_crypto: req.body.favorites_crypto
        },
        email = req.body.email,
        badValues = [null, undefined, ""],
        GET_ALL_USERS_WHERE_NO_USER = `SELECT * FROM USERS WHERE id != ${id}`;

    client
        .query(GET_ALL_USERS_WHERE_NO_USER)
        .then(result1 => {
            for (let i = 0; i < result1.rows.length; i++)
                if (!badValues.includes(email) && result1.rows[i].email === email) {
                    res.status(400).json({
                        error: "email already taken"
                    })
                    return
                }
            const setFormat = [];
            for (let [key, value] of Object.entries(params)) {
                if (!badValues.includes(value)) {
                    if (key === 'keyword')
                        setFormat.push(`${key} = ARRAY [${value.map(e => {
                            return `'${e}'`
                        }).join()}]`)
                    else if (key === 'favorites_crypto')
                        setFormat.push(`${key} = ARRAY [${value}]`)
                    else
                        setFormat.push(`${key} = '${value}'`)
                }
            }

            let INSERT_USER = `UPDATE USERS SET ${setFormat.join()} WHERE id = ${id}`
            client
                .query(INSERT_USER)
                .then(result2 => {
                    res.status(200).send("OK").end()
                })
                .catch(e => errorQuery(e, res))
        })
        .catch(e => errorQuery(e, res))
});

module.exports = router;
