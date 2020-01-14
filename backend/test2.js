const WebSocket = require('ws')
const url = 'ws://localhost:5005/ws'
const ws = new WebSocket(url)

// connection.onopen = () => {
//     connection.send('Message From Client')
// }

// connection.onerror = (error) => {
//     console.log(`WebSocket error: ${error}`)
// }

// connection.onmessage = (e) => {
//     console.log(e.data)
// }

ws.on('open', function open() {
    console.log("Client: opening ws");
});

ws.on('message', function incoming(data) {
    console.log("client")
    console.log(JSON.parse(data));
});