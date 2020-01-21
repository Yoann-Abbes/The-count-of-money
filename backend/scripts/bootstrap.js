const axios = require('axios');
const { Client } = require('pg');
const cliProgress = require('cli-progress');

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

const SelectedCryptos = ['BTC', 'ETH', 'XRP', 'LTC', 'BCH', 'USDT', 'EOS', 'BNB', 'BSV', 'TRX']
const Devise = 'EUR'
const ApiKey = argv.api_key;
const NumberOfDays = 60;
const NumberOfHours = 48;
const NumberOfMinuts = 120;

// GET ALL CRYPTOS INFOS
const getCryptoList = async () => {
    const coinListUrl = `https://min-api.cryptocompare.com/data/all/coinlist`;
    let cryptoListQuery = 'INSERT INTO crypto_list (symbol, fullname, picture_url) VALUES\n';
    let imageUrl, fullName;

    const cryptoListBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    cryptoListBar.start(SelectedCryptos.length, 0);

    const cryptoListResponse = await axios.get(coinListUrl)
    for (const [index, crypto] of SelectedCryptos.entries()) {
        cryptoListBar.update(index + 1);
        imageUrl = `https://www.cryptocompare.com/${cryptoListResponse.data.Data[crypto].ImageUrl}`
        fullName = cryptoListResponse.data.Data[crypto].CoinName
        cryptoListQuery += `('${crypto}', '${fullName}', '${imageUrl}'),\n`
    }
    cryptoListQuery = cryptoListQuery.slice(0, -2);
    cryptoListQuery += ';'

    await client.query(cryptoListQuery)
    cryptoListBar.stop()
}

// GET EACH CRYPTO VALUES FOR 60 LAST DAYS
const getCryptosDays = async () => {
    let cryptoDaysQuery = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';

    const cryptoDaysBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    cryptoDaysBar.start(NumberOfDays * SelectedCryptos.length, 0);

    for (const [index, crypto] of SelectedCryptos.entries()) {
        const cryptoDaysUrl = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${crypto}&tsym=${Devise}&limit=${NumberOfDays}&api_key=${ApiKey}`;
        const cryptoDaysResponse = await axios.get(cryptoDaysUrl)
        const days = cryptoDaysResponse.data.Data.Data;
        for (const [indexDay, day] of days.entries()) {
            cryptoDaysBar.update(indexDay + index * NumberOfDays);
            cryptoDaysQuery += `('${index + 1}', 'days', to_timestamp(${day.time}), '${day.open}', '${day.high}', '${day.low}', '${day.close}'),\n`
        }
    }
    cryptoDaysQuery = cryptoDaysQuery.slice(0, -2);
    cryptoDaysQuery += ';'

    await client.query(cryptoDaysQuery)
    cryptoDaysBar.stop()
};


// GET EACH CRYPTO VALUES FOR 48 LAST HOURS
const getCryptosHours = async () => {
    let cryptoHoursQuery = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';

    const cryptoHoursBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    cryptoHoursBar.start(NumberOfHours * SelectedCryptos.length, 0);

    for (const [index, crypto] of SelectedCryptos.entries()) {
        const cryptoHoursUrl = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${crypto}&tsym=${Devise}&limit=${NumberOfHours}&api_key=${ApiKey}`;
        const cryptoHoursResponse = await axios.get(cryptoHoursUrl)
        const hours = cryptoHoursResponse.data.Data.Data;
        for (const [indexHour, hour] of hours.entries()) {
            cryptoHoursBar.update(indexHour + index * NumberOfHours);
            cryptoHoursQuery += `('${index + 1}', 'hours', to_timestamp(${hour.time}), '${hour.open}', '${hour.high}', '${hour.low}', '${hour.close}'),\n`
        }

    }
    cryptoHoursQuery = cryptoHoursQuery.slice(0, -2);
    cryptoHoursQuery += ';'

    await client.query(cryptoHoursQuery)
    cryptoHoursBar.stop()
};


// GET EACH CRYPTO VALUES FOR 120 LAST MINUTS
const getCryptosMinuts = async () => {
    let cryptoMinutsQuery = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';

    const cryptoMinutsBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    cryptoMinutsBar.start(NumberOfMinuts * SelectedCryptos.length, 0);

    for (const [index, crypto] of SelectedCryptos.entries()) {
        const cryptoMinutsUrl = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${crypto}&tsym=${Devise}&limit=${NumberOfMinuts}&api_key=${ApiKey}`;
        const cryptoMinutsResponse = await axios.get(cryptoMinutsUrl)
        const minutes = cryptoMinutsResponse.data.Data.Data;
        for (const [indexMinut, minute] of minutes.entries()) {
            cryptoMinutsBar.update(indexMinut + index * NumberOfMinuts);
            cryptoMinutsQuery += `('${index + 1}', 'minuts', to_timestamp(${minute.time}), '${minute.open}', '${minute.high}', '${minute.low}', '${minute.close}'),\n`
        }
    }
    cryptoMinutsQuery = cryptoMinutsQuery.slice(0, -2);
    cryptoMinutsQuery += ';'

    await client.query(cryptoMinutsQuery)
    cryptoMinutsBar.stop()
};

(async () => {
    try {
        console.log('Fetching crypto Informations...');
        await getCryptoList();
        console.log('Crypto Informations successfully loaded!\n');

        console.log(`Fetching crypto values of last ${NumberOfDays} days...`);
        await getCryptosDays();
        console.log('Crypto Days successfully loaded!\n');

        console.log(`Fetching crypto values of last ${NumberOfHours} hours...`);
        await getCryptosHours();
        console.log('Crypto Hours successfully loaded!\n');

        console.log(`Fetching crypto values of last ${NumberOfMinuts} minutes...`);
        await getCryptosMinuts();
        console.log('Crypto Minutes successfully loaded!');

    } catch (error) {
        console.log(error.message);
    } finally {
        client.end()
    }
})();
