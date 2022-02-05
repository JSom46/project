"use strict";
require('dotenv').config();
const express = require('express');
const router = express.Router();

const con = require('./dbCon.js');

/*
con.get("SELECT strftime ('%s', 'now')", (err, res) => {
    if(err){
        console.log(err.name + " | " + err.message);
        throw err;
    }
    console.log(res);
});

con.get("SELECT datetime(strftime ('%s', 'now'), 'unixepoch')", (err, res) => {
    if(err){
        console.log(err.name + " | " + err.message);
        throw err;
    }
    console.log(res);
});
*/

module.exports = router;