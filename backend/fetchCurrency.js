const WebSocket = require('ws')
const axios = require('axios')
const url = 'ws://localhost:5005/refreshCurrency'
const cron = require("node-cron");
const apiUrl = 'https://min-api.cryptocompare.com/data/v2/histominute?fsym=BTC&tsym=EUR&limit=1&api_key=d9a6b09f786d982185dbd38590dca29de06be1e5239482bbba0b249241948838'
let connectionOK = false;
let interval = null;
let ws = null;
const client = require('./config/clientPg')


const intervalFunc = () => {
    ws = new WebSocket(url);
    ws.addEventListener('error', (err) => {
        connectionOk = false
    });
    ws.addEventListener('open', (err) => {
        connectionOK = true
        if (interval !== null) {
            clearInterval(interval)
            interval = null;
        }
    });
    ws.addEventListener('close', (err) => {
        connectionOK = false
    });
}

interval = setInterval(intervalFunc, 1000);

const getData = async () => {
    const response = await axios.get(apiUrl);
    let query = 'INSERT INTO CRYPTO_HISTORY (crypto_id, timestamp, open, high, low, close) VALUES (';
    query +=`1, ${}`
    query += ');'

    client
        .query(query)
        .then(result => {
            res.json({
                role: "anomyme",
                test: result.rows
            })
        })
        .catch(e => console.error(e.stack))


    return response.data;
}

cron.schedule("0 * * * * *", async () => {
    const response = await getData();

    if (!connectionOK && interval === null) {
        interval = setInterval(intervalFunc, 1000);
    } else if (connectionOK) {
        ws.send(JSON.stringify(response));
    }
});
