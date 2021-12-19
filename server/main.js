"use strict";

const express = require('express');
const helmet = require ('helmet');
const authRoute = require('./auth.js');

const app = express();
app.use(helmet());
app.use(express.json());
app.use('/api/auth', authRoute);

app.listen(2400, () => {
	console.log("Server started: 2400");
});