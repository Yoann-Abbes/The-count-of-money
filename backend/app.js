
const express = require('express')
const app = express()
const port = 3040

app.get('/', function (req, res) {
  res.json({
    test: 'Hello World!'
  })
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!')
})

