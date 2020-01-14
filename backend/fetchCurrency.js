const WebSocket = require('ws')
const url = 'ws://localhost:5005/ws'
const ws = new WebSocket(url)
const cron = require("node-cron");


cron.schedule("*/1 * * * * *", function () {
    console.log("cron")
    ws.send('data api done');
});
ws.on('message', function incoming(data) {
    console.log("client")
    console.log(JSON.parse(data));
});