"use strict";
require('dotenv').config();

const bcrypt = require('bcrypt');

const sqlite3 = require('sqlite3').verbose();
const con = new sqlite3.Database('./db/serverdb.db', (err) => {
    if(err){
		console.log('db connecting error! ' + err.message);
		throw err;
	}
});


con.serialize(() => {
    //utworzenie tabeli users, jeśli jeszcze nie istnieje
    con.run(`CREATE TABLE IF NOT EXISTS users(
                id INTEGER PRIMARY KEY, 
                login TEXT NOT NULL, 
                password TEXT NOT NULL, 
                email TEXT UNIQUE NOT NULL, 
                activation_code TEXT, 
                is_activated INTEGER, 
                is_native INTEGER, 
                is_admin INTEGER, 
                password_change_token TEXT, 
                password_token_expiration INTEGER);`, (err) => {
        if(err){
            console.log(err.name + " | " + err.message);
            throw err;
        }
    });

    con.get('SELECT COUNT(*) num FROM users', (err, result) => {
        if(err){
            console.log(err.name + " | " + err.message);
            throw err;
        }
        //jesli w tabeli users nie ma zadnych rekordow, tworzone jest konto admin z uprawnieniami administratora
        if(result.num == 0){
            bcrypt.hash(process.env.ADMIN_PASSWD, 10, (err, hash) => {
                if(err){
                    console.log(err.name + " | " + err.message);
                    throw err;
                }
                con.run(`INSERT INTO users(
                            login, 
                            password, 
                            email, 
                            is_activated, 
                            is_native, 
                            is_admin) 
                        VALUES(
                            "admin", 
                            "${hash}", 
                            "${process.env.ADMIN_EMAIL}", 
                            1, 
                            1, 
                            1)`, (err) => {
                    if(err){
                        console.log(err.name + " | " + err.message);
                        throw err;
                    }
                });
            });
        }
    });
});


//utworzenie tabeli ogloszen, jesli nie istnieje
con.run(`CREATE TABLE IF NOT EXISTS anons(
            id INTEGER PRIMARY KEY, 
            title TEXT NOT NULL, 
            description TEXT NOT NULL, 
            category INTEGER NOT NULL, 
            images TEXT, 
            author_id INTEGER NOT NULL, 
            create_date INTEGER NOT NULL, 
            lat REAL NOT NULL, 
            lng REAL NOT NULL, 
            type TEXT NOT NULL, 
            coat TEXT, 
            color TEXT, 
            breed TEXT, 
            is_active INTEGER NOT NULL);`, (err) => {
    if(err){
        console.log(err.name + " | " + err.message);
        throw err;
    }
});


//utworzenie tabeli notyfikacji, jesli nie istnieje
con.run(`CREATE TABLE IF NOT EXISTS notifications(
            id INTEGER PRIMARY KEY, 
            anon_id INTEGER NOT NULL, 
            image TEXT, 
            lat REAL NOT NULL, 
            lng REAL NOT NULL, 
            is_new INTEGER, 
            create_date INTEGER NOT NULL)`, (err) => {
    if(err){
        console.log(err.name + " | " + err.message);
        throw err;
    }
});


//usuwanie przedawnionych notyfikacji i dezaktywowanie przeterminowanych ogłoszeni w okreslonym interwale
setInterval(() => {
    //usuniecie przedawnionych notyfikacji
    con.run('DELETE FROM notifications WHERE ((? / 1000) - create_date) > ?;', Date.now(), parseInt(process.env.NOTIFICATION_TTL), (err) => {
        if(err){
            console.log(err.name + " | " + err.message);
            throw err;
        }
    });

    //dezaktywacja przeterminowanych ogloszen
    con.run('UPDATE anons SET is_active = 0 WHERE ((? / 1000) - create_date) > ?;', Date.now(), parseInt(process.env.ANON_TTL), (err) => {
        if(err){
            console.log(err.name + " | " + err.message);
            throw err;
        }
    });

    //usuniecie zbyt dlugo nieaktywnych ogloszen
    con.run('DELETE FROM anons WHERE ((? / 1000) - create_date) > ?;', Date.now(), parseInt(process.env.INACTIVE_ANON_TTL), (err) => {
        if(err){
            console.log(err.name + " | " + err.message);
            throw err;
        }
    });
}, parseInt(process.env.INTERVAL));


module.exports = con;
