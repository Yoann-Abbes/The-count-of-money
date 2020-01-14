const WebSocket = require('ws')
const url = 'ws://localhost:5005/getCurrency?currency=BTC'
const ws = new WebSocket(url)

ws.on('open', function open() {
    console.log("Client: opening ws");
});

ws.on('message', function incoming(data) {
    console.log("client")
    console.log(JSON.parse(data));
});


ws.on('message', function incoming(data) {
    console.log("client")
});