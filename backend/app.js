<<<<<<< HEAD
=======

>>>>>>> 1-dev
const express = require('express')
const app = express()
const port = 3040

<<<<<<< HEAD
const { Pool, Client } = require('pg')

const client = new Client({
    user: 'api_user',
    host: '127.0.0.1',
    database: 'crytpodb',
    password: 'password',
    port: 5432,
})
client.connect()

client.query('select * from history', (err, res) => {
    console.log(err, res.rows)
    client.end()
})

app.get('/', function (req, res) {
    // client.query('select * from books', (err, ress) => {
    //     console.log(err, ress)
    //     // client.end()
    //     res.send(ress)
    // })
    
    // res.json({
    //     test: 'Hello World!'
    // })
})

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!')
})
=======
app.get('/', function (req, res) {
  res.json({
    test: 'Hello World!'
  })
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!')
})

>>>>>>> 1-dev
