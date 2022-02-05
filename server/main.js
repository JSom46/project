"use strict";

require('dotenv').config();
const express = require('express');
const helmet = require ('helmet');
const authRoute = require('./auth.js');
const anonsRoute = require('./anons.js');
const cors = require('cors');

const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: parseInt(process.env.COOKIE_MAXAGE),
        secure: false
    }
}));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(helmet());
app.use(express.json());

app.use('/auth', authRoute);
app.use('/anons', anonsRoute);

app.listen(2400, () => {
	console.log("Server started: 2400");
});