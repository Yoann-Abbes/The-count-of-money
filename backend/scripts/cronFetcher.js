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

const Devise = 'EUR'
const ApiKey = argv.api_key;

const getCryptoListDb = async () => {
    const cryptoListQuery = 'SELECT * FROM CRYPTO_LIST;';

    const cryptoList = await client.query(cryptoListQuery);
    return cryptoList.rows;
}

const deleteLastPeriod = async (period) => {
    const cryptoList = await getCryptoListDb();
    for (const crypto of cryptoList) {
        const deleteQuery = `DELETE FROM crypto_history WHERE id IN (SELECT id FROM crypto_history WHERE period = '${period}' AND crypto_id = ${crypto.id} ORDER BY timestamp LIMIT 1);`
        await client.query(deleteQuery)
        console.log(`Latest ${period} successfully deleted for ${crypto.symbol}!`)
    }
}


// GET EACH CRYPTO VALUES FOR THE LAST DAY
const getCryptosDay = async () => {
    const cryptoList = await getCryptoListDb();
    console.log('Fetching day for', cryptoList.map((c) => c.symbol).toString());

    let cryptoDayQuery = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';
    for (const crypto of cryptoList) {
        const cryptoDayUrl = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${crypto.symbol}&tsym=${Devise}&limit=1&api_key=${ApiKey}`;
        const cryptoDayResponse = await axios.get(cryptoDayUrl)
        const day = cryptoDayResponse.data.Data.Data[1];
        cryptoDayQuery += `('${crypto.id}', 'daily', to_timestamp(${day.time}), '${day.open}', '${day.high}', '${day.low}', '${day.close}'),\n`
    }
    cryptoDayQuery = cryptoDayQuery.slice(0, -2);
    cryptoDayQuery += ';'

    console.log('Inserting Day in DB');
    await client.query(cryptoDayQuery)
    console.log('Day successfully fetched and inserted!')
    await deleteLastPeriod('daily');
};


// GET EACH CRYPTO VALUES FOR THE LAST HOUR
const getCryptosHour = async () => {
    const cryptoList = await getCryptoListDb();
    console.log('Fetching hour for', cryptoList.map((c) => c.symbol).toString());

    let cryptoHourQuery = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';
    for (const crypto of cryptoList) {
        const cryptoHourUrl = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${crypto.symbol}&tsym=${Devise}&limit=1&api_key=${ApiKey}`;
        const cryptoHourResponse = await axios.get(cryptoHourUrl)
        const hour = cryptoHourResponse.data.Data.Data[1];
        cryptoHourQuery += `('${crypto.id}', 'hourly', to_timestamp(${hour.time}), '${hour.open}', '${hour.high}', '${hour.low}', '${hour.close}'),\n`
    }
    cryptoHourQuery = cryptoHourQuery.slice(0, -2);
    cryptoHourQuery += ';'

    console.log('Inserting Hour in DB');
    await client.cryptoHourQuery(cryptoHourQuery)
    console.log('Hour successfully fetched and inserted!')
    await deleteLastPeriod('hourly');

};


// GET EACH CRYPTO VALUES FOR THE LAST MINUT
const getCryptosMinute = async () => {
    const cryptoList = await getCryptoListDb();
    console.log('Fetching minute for', cryptoList.map((c) => c.symbol).toString());

    let cryptoMinuteQuery = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';
    for (const crypto of cryptoList) {
        const cryptoMinuteUrl = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${crypto.symbol}&tsym=${Devise}&limit=1&api_key=${ApiKey}`;
        const cryptoMinuteResponse = await axios.get(cryptoMinuteUrl)
        const minute = cryptoMinuteResponse.data.Data.Data[1];
        cryptoMinuteQuery += `('${crypto.id}', 'minute', to_timestamp(${minute.time}), '${minute.open}', '${minute.high}', '${minute.low}', '${minute.close}'),\n`
    }
    cryptoMinuteQuery = cryptoMinuteQuery.slice(0, -2);
    cryptoMinuteQuery += ';'

    console.log('Inserting Minute in DB');
    await client.query(cryptoMinuteQuery)
    console.log('Minute successfully fetched and inserted!')
    await deleteLastPeriod('minute');
};

(async () => {
    try {
        const dayJob = new CronJob('00 00 00 * * *', () => {
            getCryptosDay();
        });
        const minuteJob = new CronJob('0 * * * * *', () => {
            getCryptosMinute();
        });
        const hourJob = new CronJob('0 0 * * * *', () => {
            getCryptosHour();
        });

        dayJob.start();
        minuteJob.start();
        hourJob.start();
    } catch (error) {
        console.log(error.message);
    }
})();
