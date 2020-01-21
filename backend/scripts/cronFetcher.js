const axios = require('axios');
const { Client } = require('pg');
const CronJob = require('cron').CronJob;

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

const symbol = 'EUR'
const api_key = argv.api_key;


const deleteLastPeriod = async (period) => {
    const cryptos = await getCryptoListDb();
    for (const crypto of cryptos) {
        const query = `DELETE FROM crypto_history WHERE id IN (SELECT id FROM crypto_history WHERE period = '${period}' AND crypto_id = ${crypto.id} ORDER BY timestamp LIMIT 1);`
        await client
            .query(query)
            .then(() => {
                console.log(`Latest ${period} successfully deleted!`)
            })
            .catch(e => console.error(e.stack))
    }
}

const getCryptoListDb = async () => {
    const query = 'SELECT * FROM CRYPTO_LIST;';

    return client
        .query(query)
        .then((response) => {
            return response.rows;
        })
        .catch(e => console.error(e.stack))
}

// GET EACH CRYPTO VALUES FOR THE LAST DAY
const getCryptosDay = async () => {
    const cryptos = await getCryptoListDb();
    console.log('Fetching day for', cryptos.map((c) => c.symbol).toString());

    let query = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';
    for (const crypto of cryptos) {

        const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${crypto.symbol}&tsym=${symbol}&limit=1&api_key=${api_key}`;
        await axios.get(url)
            .then(response => {
                const day = response.data.Data.Data[1];
                query += `('${crypto.id}', 'daily', to_timestamp(${day.time}), '${day.open}', '${day.high}', '${day.low}', '${day.close}'),\n`
            })
    }
    query = query.slice(0, -2);
    query += ';'

    console.log('Inserting Day in DB');
    await client
        .query(query)
        .then(() => {
            console.log('Day successfully fetched and inserted!')
        })
        .catch(e => console.error(e.stack))

    await deleteLastPeriod('daily');
};


// GET EACH CRYPTO VALUES FOR THE LAST HOUR
const getCryptosHour = async () => {
    const cryptos = await getCryptoListDb();

    console.log('Fetching hour for', cryptos.map((c) => c.symbol).toString());

    let query = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';
    for (const crypto of cryptos) {
        const url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${crypto.symbol}&tsym=${symbol}&limit=1&api_key=${api_key}`;
        await axios.get(url)
            .then(response => {
                const hour = response.data.Data.Data[1];
                query += `('${crypto.id}', 'hourly', to_timestamp(${hour.time}), '${hour.open}', '${hour.high}', '${hour.low}', '${hour.close}'),\n`
            })
    }
    query = query.slice(0, -2);
    query += ';'

    console.log('Inserting Hour in DB');
    await client
        .query(query)
        .then(() => {
            console.log('Hour successfully fetched and inserted!')
        })
        .catch(e => console.error(e.stack))
    await deleteLastPeriod('hourly');

};


// GET EACH CRYPTO VALUES FOR THE LAST MINUT
const getCryptosMinut = async () => {
    const cryptos = await getCryptoListDb();

    console.log('Fetching minut for', cryptos.map((c) => c.symbol).toString());

    let query = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';
    for (const crypto of cryptos) {
        const url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${crypto.symbol}&tsym=${symbol}&limit=1&api_key=${api_key}`;
        await axios.get(url)
            .then(response => {
                const minut = response.data.Data.Data[1];
                query += `('${crypto.id}', 'minute', to_timestamp(${minut.time}), '${minut.open}', '${minut.high}', '${minut.low}', '${minut.close}'),\n`
            })
    }
    query = query.slice(0, -2);
    query += ';'

    console.log('Inserting Minut in DB');

    await client
        .query(query)
        .then(() => {
            console.log('Minut successfully fetched and inserted!')
        })
        .catch(e => console.error(e.stack))

    await deleteLastPeriod('minute');
};

(async () => {
    try {
        const dayJob = new CronJob('00 00 00 * * *', () => {
            getCryptosDay();
        });
        const minutJob = new CronJob('0 * * * * *', () => {
            getCryptosMinut();
        });
        const hourJob = new CronJob('0 0 * * * *', () => {
            getCryptosHour();
        });

        dayJob.start();
        minutJob.start();
        hourJob.start();
    } catch (error) {
        console.log(error.message);
    }
})();
