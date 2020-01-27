DROP DATABASE IF EXISTS money;
CREATE DATABASE money;
\c money;
DROP TABLE IF EXISTS RSS_LIST CASCADE;
CREATE TABLE RSS_LIST (
    id serial PRIMARY KEY,
    link VARCHAR(500) NOT NULL,
    name VARCHAR(255)
);

DROP TABLE IF EXISTS RSS_HISTORY CASCADE;
CREATE TABLE RSS_HISTORY (
    id serial PRIMARY KEY,
    rss_id BIGINT NOT NULL,
    title VARCHAR(255),
    link TEXT,
    content TEXT,
    creator VARCHAR(255),
    pubDate TIMESTAMP,
    categories VARCHAR(500) [],
    FOREIGN KEY (rss_id) REFERENCES RSS_LIST
);

DROP TABLE IF EXISTS CRYPTO_LIST CASCADE;
CREATE TABLE CRYPTO_LIST (
    id serial PRIMARY KEY,
    symbol VARCHAR(6),
    fullName VARCHAR(500),
    picture_url TEXT
);

DROP TABLE IF EXISTS CRYPTO_HISTORY CASCADE;
CREATE TABLE CRYPTO_HISTORY (
    id serial PRIMARY KEY,
    crypto_id BIGINT NOT NULL,
    period VARCHAR(10),
    timestamp TIMESTAMP,
    price FLOAT,
    open FLOAT,
    high FLOAT,
    low FLOAT,
    close FLOAT,
    FOREIGN KEY (crypto_id) REFERENCES CRYPTO_LIST
);
SET timezone = 'America/Los_Angeles';

DROP TABLE IF EXISTS USERS CASCADE;
CREATE TABLE USERS (
    id serial PRIMARY KEY,
    is_admin BOOLEAN NOT NULL,
    email VARCHAR(500) NOT NULL,
    password VARCHAR(500) NOT NULL,
    username VARCHAR(500) NOT NULL,
    picture_url TEXT,
    keyword VARCHAR(500) [],
    favorites_crypto BIGINT []
);

INSERT INTO USERS VALUES (
    nextval('users_id_seq'),
    false,
    'yoann.abbes@gmail.com',
    'testmdp',
    'testuser',
    'http://osef.com',
    ARRAY ['bitcoin', 'etherum'],
    ARRAY [1, 2]
);

INSERT INTO USERS VALUES (
    nextval('users_id_seq'),
    false,
    'yoann1.abbes@epitech.eu',
    'testmdp2',
    'testuser2',
    'http://osef2.com',
    ARRAY ['bitcoin', 'etherum'],
    ARRAY [1, 2]
);

INSERT INTO RSS_LIST (link, name) VALUES (
    'https://bitcoin.fr/feed/',
    'BitCoin'
),(
    'https://cryptogains.fr/feed',
    'CryptoGains'
),(
    'https://cryptonaute.fr/feed/',
    'CryptoNaute'
),(
    'https://news.crypto-analyse.com/feed/',
    'CryptoAnalyse'
),(
    'https://cryptoactu.com/feed/',
    'CryptoActu'
);
