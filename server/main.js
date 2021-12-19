"use strict";

const express = require('express');
const helmet = require ('helmet');
const authRoute = require('./auth.js');
const cors = require('cors');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoute);

app.listen(2400, () => {
	console.log("Server started: 2400");
});