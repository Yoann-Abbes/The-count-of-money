const { Client } = require('pg');
const CronJob = require('cron').CronJob;
let Parser = require('rss-parser')
let parser = new Parser({
    timeout: 5000,
    headers: { 'Accept': 'application/rss+xml, text/xml; q=0.1' },
});

const argv = require('yargs')
    .usage('Usage: You need to run the init-db.sh script to clear the database before run this one to populate it.')
    .default('user', 'postgres')
    .default('host', 'localhost')
    .default('database', 'money')
    .default('password', 'postgres')
    .default('port', '5432').argv;

const client = new Client({
    user: argv.user,
    host: argv.host,
    database: argv.database,
    password: argv.password,
    port: argv.port
});

// const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const CORS_PROXY = '';
const RSS_INIT_QUERY = 'INSERT INTO rss_history (rss_list_id, title, link, content, creator, pubDate, categories) VALUES \n';

const checkIfExistQuery = async (item) => {
    let checkIfExistQuery = 'SELECT id FROM rss_history where link = \'';
    checkIfExistQuery += item.link;
    checkIfExistQuery += '\';';
    const result = await client.query(checkIfExistQuery);
    return result.rows.length >= 1;
}

const getRssListDb = async () => {
    const rssListQuery = 'SELECT * FROM RSS_LIST;';

    const rssList = await client.query(rssListQuery);
    return rssList.rows;
};

// GET EACH CRYPTO VALUES FOR THE LAST MINUT
const getRssHistory = async () => {
    const rssList = await getRssListDb();
    console.log('Fetching rss articles\n');
    let rssHistoryQuery = RSS_INIT_QUERY;
    for (const rss of rssList) {
        try {
            const feed = await parser.parseURL(CORS_PROXY + rss.link);
            for (const item of feed.items) {
                item.title = item.title.replace("'", '`')
                if (!await checkIfExistQuery(item)) {
                    console.log("Adding :", rss.id, rss.name, rss.link);
                    item.content = item.content.replace('[ ]', '[...]')
                    item.content = item.content.replace("'", '`')
                    item.creator = item.creator.replace("'", '`')
                    rssHistoryQuery += `('${rss.id}', '${item.title}', '${item.link}', '${item.content}', '${item.creator}', to_timestamp(${Date.parse(item.pubDate)}), ARRAY [${item.categories.map(c => `'${c}'`).toString()}]),\n`;
                }
            }
        } catch (error) {
            console.log("***ERROR***", rss.name, error.message);
        }
    }
    if (rssHistoryQuery !== RSS_INIT_QUERY) {
        rssHistoryQuery = rssHistoryQuery.slice(0, -2);
        rssHistoryQuery += ';';   
        console.log('Inserting RSS HISTORY in DB');
        await client.query(rssHistoryQuery);
        console.log('RSS articles successfully fetched and inserted!\n');
    } else {
        console.log('Nothing to add for now\n');
        
    }
};

(async () => {
    try {
        client.connect();
        await getRssHistory();
        const rssJob = new CronJob('*/5 * * * *', () => {
            getRssHistory();
        });
        rssJob.start();
    } catch (error) {
        console.log(error.message);
    }
})();
