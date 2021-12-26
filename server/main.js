"use strict";

require('dotenv').config();
const express = require('express');
const helmet = require ('helmet');
const authRoute = require('./auth.js');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: parseInt(process.env.COOKIE_MAXAGE) }
}));
app.use(helmet());
app.use(express.json());
app.use(cors({
	origin: process.env.SERVER_ROOT_URI,
	credentials: true,
  }));
app.use('/auth', authRoute);

app.listen(2400, () => {
	console.log("Server started: 2400");
});