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

const cryptos = ['BTC', 'ETH', 'XRP', 'LTC', 'BCH', 'USDT', 'EOS', 'BNB', 'BSV', 'TRX']
const symbol = 'EUR'
const api_key = argv.api_key;
const numberOfDays = 60;
const numberOfHours = 48;
const numberOfMinuts = 120;

// GET ALL CRYPTOS INFOS
const getCryptoList = async () => {
    const url = `https://min-api.cryptocompare.com/data/all/coinlist`;
    let query = 'INSERT INTO crypto_list (symbol, fullname, picture_url) VALUES\n';
  
    const cryptoListBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    cryptoListBar.start(cryptos.length, 0);
  
    await axios.get(url)
        .then(response => {
            let imageUrl, fullName;
            for (const [index, crypto] of cryptos.entries()) {
                cryptoListBar.update(index + 1);
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
    cryptoListBar.stop()
}

// GET EACH CRYPTO VALUES FOR 60 LAST DAYS
const getCryptosDays = async () => {
    let query = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';

    const cryptoDaysBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    cryptoDaysBar.start(numberOfDays * cryptos.length, 0);

    for (const [index, crypto] of cryptos.entries()) {
        const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${crypto}&tsym=${symbol}&limit=${numberOfDays}&api_key=${api_key}`;
        await axios.get(url)
            .then(response => {
                const days = response.data.Data.Data;
                for (const [indexDay, day] of days.entries()) {
                    cryptoDaysBar.update(indexDay + index * numberOfDays);
                    query += `('${index + 1}', 'days', to_timestamp(${day.time}), '${day.open}', '${day.high}', '${day.low}', '${day.close}'),\n`
                }

            })
    }
    query = query.slice(0, -2);
    query += ';'

    await client
        .query(query)
        .catch(e => console.error(e.stack))
    cryptoDaysBar.stop()
};


// GET EACH CRYPTO VALUES FOR 48 LAST HOURS
const getCryptosHours = async () => {
    let query = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';

    const cryptoHoursBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    cryptoHoursBar.start(numberOfHours * cryptos.length, 0);

    for (const [index, crypto] of cryptos.entries()) {
        const url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${crypto}&tsym=${symbol}&limit=${numberOfHours}&api_key=${api_key}`;
        await axios.get(url)
            .then(response => {
                const hours = response.data.Data.Data;
                for (const [indexHour, hour] of hours.entries()) {
                    cryptoHoursBar.update(indexHour + index * numberOfHours);
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
    cryptoHoursBar.stop()
};


// GET EACH CRYPTO VALUES FOR 120 LAST MINUTS
const getCryptosMinuts = async () => {
    let query = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';

    const cryptoMinutsBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    cryptoMinutsBar.start(numberOfMinuts * cryptos.length, 0);

    for (const [index, crypto] of cryptos.entries()) {
        const url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${crypto}&tsym=${symbol}&limit=${numberOfMinuts}&api_key=${api_key}`;
        await axios.get(url)
            .then(response => {
                const minuts = response.data.Data.Data;
                for (const [indexMinut, minut] of minuts.entries()) {
                    cryptoMinutsBar.update(indexMinut + index * numberOfMinuts);
                    query += `('${index + 1}', 'minuts', to_timestamp(${minut.time}), '${minut.open}', '${minut.high}', '${minut.low}', '${minut.close}'),\n`
                }
            })
    }
    query = query.slice(0, -2);
    query += ';'

    await client
        .query(query)
        .catch(e => console.error(e.stack))
    cryptoMinutsBar.stop()
};

(async () => {
    try {
        console.log('Fetching crypto Informations...');
        await getCryptoList();
        console.log('Crypto Informations successfully loaded!\n');

        console.log(`Fetching crypto values of last ${numberOfDays} days...`);
        await getCryptosDays();
        console.log('Crypto Days successfully loaded!\n');

        console.log(`Fetching crypto values of last ${numberOfHours} hours...`);
        await getCryptosHours();
        console.log('Crypto Hours successfully loaded!\n');

        console.log(`Fetching crypto values of last ${numberOfMinuts} minuts...`);
        await getCryptosMinuts();
        console.log('Crypto Minuts successfully loaded!');
        
    } catch (error) {
        console.log(error.message);
    } finally {
        client.end()
    }
})();
