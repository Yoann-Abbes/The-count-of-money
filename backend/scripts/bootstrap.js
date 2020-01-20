const axios = require('axios');
const { Client } = require('pg');

const argv = require('yargs')
    .usage('Usage: You need to run the init-db.sh script to clear the database before run this one to populate it.')
    .default('user', 'postgres')
    .default('host', 'localhost')
    .default('database', 'money')
    .default('password', 'postgres')
    .default('api_key', process.env.API_KEY)
    .default('port', '5432').argv;

const client = new Client({
    user: argv.user,
    host: argv.host,
    database: argv.database,
    password: argv.password,
    port: argv.port
})

client.connect()

const cryptos = ['BTC', 'ETH', 'XRP', 'LTC', 'BCH', 'USDT', 'EOS', 'BNB', 'BSV', 'TRX']
const symbol = 'EUR'
const api_key = argv.api_key;

// GET ALL CRYPTOS INFOS
const getCryptoList = async () => {
    const url = `https://min-api.cryptocompare.com/data/all/coinlist`;
    let query = 'INSERT INTO crypto_list (symbol, fullname, picture_url) VALUES\n';
    await axios.get(url)
        .then(response => {
            let imageUrl, fullName;
            for (const crypto of cryptos) {
                imageUrl = `https://www.cryptocompare.com/${response.data.Data[crypto].ImageUrl}`
                fullName = response.data.Data[crypto].CoinName
                query += `('${crypto}', '${fullName}', '${imageUrl}'),\n`
            }
        })
    query = query.slice(0, -2);
    query += ';'

    await client
        .query(query)
        .catch(e => console.error(e.stack))
}

// GET EACH CRYPTO VALUES FOR 60 LAST DAYS
const getCryptosDays = async () => {
    let query = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';
    for (const [index, crypto] of cryptos.entries()) {
        const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${crypto}&tsym=${symbol}&limit=60&api_key=${api_key}`;
        await axios.get(url)
            .then(response => {
                const days = response.data.Data.Data;
                for (const day of days) {
                    query += `('${index + 1}', 'days', to_timestamp(${day.time}), '${day.open}', '${day.high}', '${day.low}', '${day.close}'),\n`
                }

            })
    }
    query = query.slice(0, -2);
    query += ';'

    await client
        .query(query)
        .catch(e => console.error(e.stack))
};


// GET EACH CRYPTO VALUES FOR 48 LAST HOURS
const getCryptosHours = async () => {
    let query = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';
    for (const [index, crypto] of cryptos.entries()) {
        const url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${crypto}&tsym=${symbol}&limit=48&api_key=${api_key}`;
        await axios.get(url)
            .then(response => {
                const hours = response.data.Data.Data;
                for (const hour of hours) {
                    date = new Date(hour.time)
                    query += `('${index + 1}', 'hours', to_timestamp(${hour.time}), '${hour.open}', '${hour.high}', '${hour.low}', '${hour.close}'),\n`
                }

            })
    }
    query = query.slice(0, -2);
    query += ';'

    await client
        .query(query)
        .catch(e => console.error(e.stack))
};


// GET EACH CRYPTO VALUES FOR 120 LAST MINUTS
const getCryptosMinuts = async () => {
    let query = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';
    for (const [index, crypto] of cryptos.entries()) {
        const url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${crypto}&tsym=${symbol}&limit=120&api_key=${api_key}`;
        await axios.get(url)
            .then(response => {
                const minuts = response.data.Data.Data;
                for (const minut of minuts) {
                    query += `('${index + 1}', 'minuts', to_timestamp(${minut.time}), '${minut.open}', '${minut.high}', '${minut.low}', '${minut.close}'),\n`
                }
            })
    }
    query = query.slice(0, -2);
    query += ';'

    await client
        .query(query)
        .catch(e => console.error(e.stack))
};

(async () => {
    try {
        await getCryptoList();
        await getCryptosDays();
        await getCryptosHours();
        await getCryptosMinuts();
    } catch (error) {
        console.log(error.message);
    } finally {
        client.end()
    }
})();
