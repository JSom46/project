"use strict";
require('dotenv').config();

const sqlite3 = require('sqlite3').verbose();
const con = new sqlite3.Database('./db/serverdb.db', (err) => {
    if(err){
		console.log('db connecting error! ' + err.message);
		throw err;
	}
});
con.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, login TEXT NOT NULL, password TEXT NOT NULL, email TEXT UNIQUE NOT NULL, activation_code TEXT, is_activated INTEGER, is_native INTEGER);', (err, res) => {
    if(err){
        console.log(err.name + " | " + err.message);
        throw err;
    }
});
con.run('CREATE TABLE IF NOT EXISTS anons(id INTEGER PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, category INTEGER NOT NULL, images TEXT, author_id INTEGER NOT NULL, create_date INTEGER NOT NULL, lat REAL, lng REAL)', (err, res) => {
    if(err){
        console.log(err.name + " | " + err.message);
        throw err;
    }
});

module.exports = con;
