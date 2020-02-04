const { exec } = require("child_process");
const axios = require('axios');
const { Client } = require('pg');
const cliProgress = require('cli-progress');
const fixtures = require('./fixtures.json')
let Parser = require('rss-parser')
let parser = new Parser({
    timeout: 5000,
    headers: { 'Accept': 'application/rss+xml, text/xml; q=0.1' },
});


const MULTI_BAR = new cliProgress.MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: '[{bar}] | {filename} | {percentage}% | {value}/{total}'
}, cliProgress.Presets.shades_grey);

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
});

const SELECTED_CRYPTOS = ['BTC', 'ETH', 'XRP', 'LTC', 'BCH', 'USDT', 'EOS', 'BNB', 'BSV', 'TRX'];
const DEVISE = 'EUR';
const APIKEY = argv.api_key;
const NUMBER_OF_DAYS = 60;
const NUMBER_OF_HOURS = 48;
const NUMBER_OF_MINUTES = 120;

// GET ALL CRYPTOS INFOS
const getCryptoList = async () => {
    const coinListUrl = `https://min-api.cryptocompare.com/data/all/coinlist`;
    let cryptoListQuery = 'INSERT INTO crypto_list (symbol, fullname, picture_url) VALUES\n';
    let imageUrl, fullName;

    const cryptoListBar = MULTI_BAR.create(SELECTED_CRYPTOS.length, 0, { filename: "Crypto List          " });

    const cryptoListResponse = await axios.get(coinListUrl);
    for (const [index, crypto] of SELECTED_CRYPTOS.entries()) {
        cryptoListBar.update(index + 1);
        imageUrl = `https://www.cryptocompare.com/${cryptoListResponse.data.Data[crypto].ImageUrl}`;
        fullName = cryptoListResponse.data.Data[crypto].CoinName;
        cryptoListQuery += `('${crypto}', '${fullName}', '${imageUrl}'),\n`;
    }
    cryptoListQuery = cryptoListQuery.slice(0, -2);
    cryptoListQuery += ';';

    await client.query(cryptoListQuery);
};

// GET EACH CRYPTO VALUES FOR 60 LAST DAYS
const getCryptosDays = async () => {
    // console.log(await client.query('SELECT * FROM crypto_list;'))

    let cryptoDaysQuery = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';

    const cryptoDaysBar = MULTI_BAR.create(NUMBER_OF_DAYS * SELECTED_CRYPTOS.length, 0, { filename: "Crypto Days values   " });

    for (const [index, crypto] of SELECTED_CRYPTOS.entries()) {
        const cryptoDaysUrl = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${crypto}&tsym=${DEVISE}&limit=${NUMBER_OF_DAYS}&api_key=${APIKEY}`;
        const cryptoDaysResponse = await axios.get(cryptoDaysUrl);
        const days = cryptoDaysResponse.data.Data.Data;
        for (const [indexDay, day] of days.entries()) {
            cryptoDaysBar.update(indexDay + index * NUMBER_OF_DAYS);
            cryptoDaysQuery += `('${index + 1}', 'daily', to_timestamp(${day.time}), '${day.open}', '${day.high}', '${day.low}', '${day.close}'),\n`;
        }
    }
    cryptoDaysQuery = cryptoDaysQuery.slice(0, -2);
    cryptoDaysQuery += ';';

    await client.query(cryptoDaysQuery);
};


// GET EACH CRYPTO VALUES FOR 48 LAST HOURS
const getCryptosHours = async () => {
    let cryptoHoursQuery = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';

    const cryptoHoursBar = MULTI_BAR.create(NUMBER_OF_HOURS * SELECTED_CRYPTOS.length, 0, { filename: "Crypto Hours values  " });

    for (const [index, crypto] of SELECTED_CRYPTOS.entries()) {
        const cryptoHoursUrl = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${crypto}&tsym=${DEVISE}&limit=${NUMBER_OF_HOURS}&api_key=${APIKEY}`;
        const cryptoHoursResponse = await axios.get(cryptoHoursUrl);
        const hours = cryptoHoursResponse.data.Data.Data;
        for (const [indexHour, hour] of hours.entries()) {
            cryptoHoursBar.update(indexHour + index * NUMBER_OF_HOURS);
            cryptoHoursQuery += `('${index + 1}', 'hourly', to_timestamp(${hour.time}), '${hour.open}', '${hour.high}', '${hour.low}', '${hour.close}'),\n`;
        }

    }
    cryptoHoursQuery = cryptoHoursQuery.slice(0, -2);
    cryptoHoursQuery += ';';

    await client.query(cryptoHoursQuery);
};


// GET EACH CRYPTO VALUES FOR 120 LAST MINUTS
const getCryptosMinuts = async () => {
    let cryptoMinutsQuery = 'INSERT INTO crypto_history (crypto_id, period, timestamp, open, high, low, close) VALUES \n';

    const cryptoMinutsBar = MULTI_BAR.create(NUMBER_OF_MINUTES * SELECTED_CRYPTOS.length, 0, { filename: "Crypto Minutes values" });

    for (const [index, crypto] of SELECTED_CRYPTOS.entries()) {
        const cryptoMinutsUrl = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${crypto}&tsym=${DEVISE}&limit=${NUMBER_OF_MINUTES}&api_key=${APIKEY}`;
        const cryptoMinutsResponse = await axios.get(cryptoMinutsUrl);
        const minutes = cryptoMinutsResponse.data.Data.Data;
        for (const [indexMinut, minute] of minutes.entries()) {
            cryptoMinutsBar.update(indexMinut + index * NUMBER_OF_MINUTES);
            cryptoMinutsQuery += `('${index + 1}', 'minute', to_timestamp(${minute.time}), '${minute.open}', '${minute.high}', '${minute.low}', '${minute.close}'),\n`;
        }
    }
    cryptoMinutsQuery = cryptoMinutsQuery.slice(0, -2);
    cryptoMinutsQuery += ';';

    await client.query(cryptoMinutsQuery);
};


const loadRssFeed = async () => {
    const insertRss = 'INSERT INTO RSS_LIST (link, name) VALUES (';
    const rssFeedsBar = MULTI_BAR.create(fixtures.rssFeeds.length, 0, { filename: "RSS Feeds list       " });

    for (const [index, rss] of fixtures.rssFeeds.entries()) {
        let query = `${insertRss} '${rss.url}', '${rss.name}');`;        
        await client.query(query);
        rssFeedsBar.update(index + 1);
    }
};

const checkIfExistQuery = async (item) => {
    let checkIfExistQuery = 'SELECT id FROM rss_history where link = \'';
    checkIfExistQuery += item.link;
    checkIfExistQuery += '\';';
    const result = await client.query(checkIfExistQuery);
    return result.rows.length >= 1;
};

const getRssListDb = async () => {
    const rssListQuery = 'SELECT * FROM RSS_LIST;';

    const rssList = await client.query(rssListQuery);
    return rssList.rows;
};

// GET EACH CRYPTO VALUES FOR THE LAST MINUT
const getRssHistory = async () => {
    const CORS_PROXY = '';
    const RSS_INIT_QUERY = 'INSERT INTO rss_history (rss_list_id, title, link, content, creator, pubDate, categories) VALUES \n';
    const rssList = await getRssListDb();
    let rssHistoryQuery = RSS_INIT_QUERY;
    
    let size = 0, current = 0;  
    const rssArticlesBar = MULTI_BAR.create(size, 0, { filename: "RSS articles         " });
    for (const rss of rssList) {
        try {
            const feed = await parser.parseURL(CORS_PROXY + rss.link);
            size += feed.items.length;
            rssArticlesBar.setTotal(size);
            for (const item of feed.items) {
                current += 1
                item.title = item.title.replace("'", '`')
                if (!await checkIfExistQuery(item)) {
                    // console.log("Adding :", rss.id, rss.name, rss.link);
                    item.content = item.content.replace('[ ]', '[...]')
                    item.content = item.content.replace("'", '`')
                    item.creator = item.creator.replace("'", '`')
                    rssHistoryQuery += `('${rss.id}', '${item.title}', '${item.link}', '${item.content}', '${item.creator}', to_timestamp(${Date.parse(item.pubDate)}), ARRAY [${item.categories.map(c => `'${c}'`).toString()}]),\n`;
                }
                rssArticlesBar.update(current)
            }
        } catch (error) {
            console.log("***ERROR***", rss.name, error.message);
        }
    }
    if (rssHistoryQuery !== RSS_INIT_QUERY) {
        rssHistoryQuery = rssHistoryQuery.slice(0, -2);
        rssHistoryQuery += ';';   
        await client.query(rssHistoryQuery);
    } else {
        console.log('Nothing to add for now\n');
    }
};

const loadUsers = async () => {
    const insertUser = 'INSERT INTO USERS VALUES (';
    const usersBar = MULTI_BAR.create(fixtures.users.length, 0, { filename: "Users                " });

    for (const [index, user] of fixtures.users.entries()) {
        let query = `${insertUser} nextval('users_id_seq'), ${user.is_admin}, '${user.email}', '${user.password}', '${user.username}', '${user.picture_url}', ARRAY [${user.keyword.map(c => `'${c}'`).toString()}], ARRAY [${user.favorites_cryptos.toString()}]);`
        await client.query(query);
        usersBar.update(index + 1);
    };
};


(async () => {
    try {
        await exec(`PGPASSWORD=${argv.password} psql -h localhost -U postgres -f db_sample.sql`, (err) => {
            if (err) console.log('EROOOOOOOOOOOOR', err);
        })
        console.log("DATABASE successfully reseted");
        
        client.connect();

        await getCryptoList();
        await getCryptosDays();
        await getCryptosHours();
        await getCryptosMinuts();
        await loadRssFeed();
        await getRssHistory();
        await loadUsers();
        MULTI_BAR.stop()
    } catch (error) {
        console.log("\n\nerrrrr", error);
        client.end();
    } finally {
        client.end();
    }
})();
