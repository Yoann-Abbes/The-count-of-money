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
router.get('/users/login', function (req, res, next) {
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
                    // TODO JWT
                    // JWT must contain userID => user.id
                    res.header({
                        JWT: "jwt"
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
router.post('/users/logout', function (req, res, next) {
    res.sendStatus(200);
});


/*
GET /users/profile
*/
router.get('/users/profile', function (req, res, next) {
    // Get id of user inside of JWT
    let id = 1; // TODO
    let GET_USERS_WHERE_ID = `SELECT * FROM USERS WHERE id = '${id}' LIMIT 1`;
    client
        .query(GET_USERS_WHERE_ID)
        .then(result => {
            delete result.rows[0].id
            delete result.rows[0].is_admin
            res.status(200).json(result.rows[0])
            // res.status(200).json({
            //     email: result.rows[0].email,
            //     username: result.rows[0].username,
            //     password: result.rows[0].password,
            //     picture_url: result.rows[0].picture_url,
            //     keyword : result.rows[0].keyword,
            //     favorites_crypto: result.rows[0].favorites_crypto
            // });
        })
        .catch(e => errorQuery(e, res))
});

/*
POST /users/profile
*/
router.post('/users/profile', function (req, res, next) {
    // Get id of user inside of JWT
    let id = 1; // TODO

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
        GET_ALL_USERS = "SELECT * FROM USERS";

    client
        .query(GET_ALL_USERS)
        .then(result1 => {
            for (let i = 0; i < result1.rows.length; i++)
                if (!badValues.includes(email) && result1.rows[i].email === email) {
                    res.status(400).json({
                        error: "email already taken"
                    })
                    return
                }
            let keys = '',
                values = '';
            for (let [key, value] of Object.entries(params)) {
                if (!badValues.includes(value)) {
                    key 
                }
                console.log(`${key}: ${value}`);
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

module.exports = router;