"use strict";

require('dotenv').config();

const express = require('express');
const helmet = require ('helmet');
const log = require('loglevel');
log.setLevel((new Set(['trace', 'debug', 'info', 'warn', 'error', 'silent'])).has(process.argv[2]) ? process.argv[2] : 'info', true);

const authRoute = require('./auth.js');
const anonsRoute = require('./anons.js');
const apiDocs = require('./api-docs.js');

const cors = require('cors');
const sqliteStoreFactory = require('express-session-sqlite').default;
const session = require('express-session');
const SqliteStore = sqliteStoreFactory(session);
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3');
const app = express();

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({
    store: new SqliteStore({
        driver: sqlite3.Database,
        //path: './db/sessiondb.db',
        path: ':memory:',
        ttl: 12 * 60 * 60 * 1000,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: parseInt(process.env.COOKIE_MAXAGE),
        secure: false
    }
}));

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(helmet());
app.use(express.json());

app.use('/auth', authRoute);
app.use('/anons', anonsRoute);
app.use('/api-docs', apiDocs);

const httpServer = require('./livechat.js');

httpServer.listen(2300, () => {
	log.info('Chat server started\nport: 2300');
});

app.listen(2400, () => {
  log.info('Server started\nport: 2400');
});
