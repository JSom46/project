"use strict";
require('dotenv').config();

const bcrypt = require('bcrypt');
const log = require('loglevel');
const sqlite3 = require('sqlite3').verbose();
const con = new sqlite3.Database('./db/serverdb.db', (err) => {
    if(err){
		log.error('connecting to database: ', err);
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
                password_token_expiration INTEGER,
                last_active_time INTEGER);`, (err) => {
        if(err){
            log.error('creating users: ', err);
            throw err;
        }
    });

    con.get('SELECT COUNT(*) num FROM users', (err, result) => {
        if(err){
            log.error('selecting num of users: ', err);
            throw err;
        }
        //jesli w tabeli users nie ma zadnych rekordow, tworzone jest konto admin z uprawnieniami administratora
        if(result.num == 0){
            bcrypt.hash(process.env.ADMIN_PASSWD, 10, (err, hash) => {
                if(err){
                    log.error('encrypting admin`s passsword:', err);
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
                        log.error('inserting admin into users: ', err);
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
        log.error('creating anons: ', err);
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
        log.error('creating notifications: ', err);
        throw err;
    }
});


// Tabele dla LIVE CHAT
// ChatMessages - wiadomości live chat
// ChatImages - obrazy wysyłane w sesjaach live chat
// ChatUsers - chatroomy z przypisanymi członkami
con.serialize(() => {
    con.run(`CREATE TABLE IF NOT EXISTS ChatUsers (
        anons_id INT,
        chat_id INT,
        user_id INT,
        last_seen_time INT,
        PRIMARY KEY (chat_id, user_id),
        FOREIGN KEY (anons_id) REFERENCES anons (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
        )`,
        (err) => {
            if (err) {
                log.error(err);
                throw err;
            }
        });
    
    con.run(`CREATE TABLE IF NOT EXISTS ChatMessages (
        message_id INT PRIMARY KEY,
        chat_id INT, 
        user_id INT,
        message_date INT,
        message_text TEXT, 
        CONSTRAINT ChatMessages_FK_user_id FOREIGN KEY (user_id) REFERENCES users (id)
        )`,
        (err) => {
            if (err) {
                log.error(err);
                throw err;
            }
        });

    con.run(`CREATE TABLE IF NOT EXISTS ChatImages (
        image_id INT PRIMARY KEY,
        message_id INT,
        user_id INT,
        filename TEXT,
        filepath TEXT,
        thumbpath TEXT,       
        mimetype TEXT,
        CONSTRAINT Images_FK_message_id FOREIGN KEY (message_id) REFERENCES ChatMessages (message_id)
        CONSTRAINT Images_FK_user_id FOREIGN KEY (user_id) REFERENCES users (id)
        )`,
        (err) => {
            if (err) {
                log.error(err);
                throw err;
            }
        });
});


// usuwanie przedawnionych notyfikacji i dezaktywowanie przeterminowanych ogłoszen w okreslonym interwale
setInterval(() => {
    /*//usuniecie przedawnionych notyfikacji
    con.run('DELETE FROM notifications WHERE ((? / 1000) - create_date) > ?;', Date.now(), parseInt(process.env.NOTIFICATION_TTL), (err) => {
        if(err){
            log.error('deleting expired notifications: ', err);
            throw err;
        }
    }); */

    /*//dezaktywacja przeterminowanych ogloszen
    con.run('UPDATE anons SET is_active = 0 WHERE ((? / 1000) - create_date) > ?;', Date.now(), parseInt(process.env.ANON_TTL), (err) => {
        if(err){
            log.error('deactivating expired anons: ', err);
            throw err;
        }
    });

    //usuniecie zbyt dlugo nieaktywnych ogloszen
    con.run('DELETE FROM anons WHERE ((? / 1000) - create_date) > ?;', Date.now(), parseInt(process.env.INACTIVE_ANON_TTL), (err) => {
        if(err){
            log.error('deleting anons inactive for too long: ', err);
            throw err;
        }
    });*/
}, parseInt(process.env.INTERVAL));


module.exports = con;
