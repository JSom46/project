"use strict";

require('dotenv').config();

const express = require('express');
const helmet = require ('helmet');
const log = require('loglevel');
log.setLevel((new Set(['trace', 'debug', 'info', 'warn', 'error', 'silent'])).has(process.argv[2]) ? process.argv[2] : 'info', true);

const authRoute = require('./auth.js');
const anonsRoute = require('./anons.js');
const apiDocs = require('./api-docs.js');
const httpServer = require('./livechat.js').httpServer;
const app = require('./livechat.js').app;

const cors = require('cors');
const sqliteStoreFactory = require('express-session-sqlite').default;
const session = require('express-session');
const SqliteStore = sqliteStoreFactory(session);
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3');

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({
    store: new SqliteStore({
        driver: sqlite3.Database,
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

httpServer.listen(process.env.PORT || 2400, () => {
	log.info(`Server started\nport: ${process.env.PORT || 2400}\n`);
});
