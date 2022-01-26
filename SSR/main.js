"use strict";

require('dotenv').config();
const express = require('express');
const helmet = require ('helmet');
const authRoute = require('./auth.js');
const cors = require('cors');
const bodyParser = require('body-parser');

const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json());
app.set('view engine', 'ejs');
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
    origin: true,
    credentials: true
}));
app.use(helmet());
app.use(express.json());

app.use('/auth', authRoute);
app.get('/', (req, res) => {
    return res.render('index', {
        session: req.session
    });
});

app.listen(2400, () => {
	console.log("Server started: 2400");
});