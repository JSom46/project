"use strict";

require('dotenv').config();
const bcrypt = require('bcrypt');
const codeGenerator = require('./codeGenerator.js');
const mailOptions = require('./mailOptions');
const express = require('express');
const cookieParser = require('cookie-parser');

const session = require('express-session');

const router = express.Router();
router.use(cookieParser());
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: parseInt(process.env.COOKIE_MAXAGE) }
}));

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_ADDR,
        pass: process.env.EMAIL_PASSWD
    }
});


const sqlite3 = require('sqlite3').verbose();
const con = new sqlite3.Database('./db/test.db', (err) => {
    if(err){
		console.log('db connecting error!');
		throw err;
	}
	console.log('connected succesfully to database!');
});
con.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, login TEXT NOT NULL, password TEXT NOT NULL, email TEXT UNIQUE NOT NULL, activation_code TEXT, is_activated INTEGER);', (err, res) => {
    if(err){
        console.log(err.name + "|" + err.message);
        throw err;
    }
});



//rejestracja req = {login : string, password : string, email : string}
router.post('/signup', (req, res) => {
    //sprawdzenie, czy mail nie jest już w uzyciu
    con.get(`SELECT "x" FROM users WHERE email = "${req.body.email}";`, (err, row) => {
        if(err){
            res.sendStatus(500);
            return;
        }
        if(row){
            //email jest juz w uzyciu
            res.status(409).json({msg: 'email already in use'});
            return;
        }
        //email jest wolny, zaszyfruj haslo
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err){
                res.sendStatus(500);
                return;
            }

            //wygeneruj kod aktywacyjny
            let code = codeGenerator(5);

            //informacje potrzebne do wyslania maila
            let mailOpt = mailOptions(process.env.EMAIL_ADDR, req.body.email, 'kod aktywacyjny', `twój kod aktywacyjny dla konta ${req.body.login} to ${code}.`);

            //dodaj usera do bazy
            con.run(`INSERT INTO users (login, password, email, activation_code, is_activated) VALUES 
                    ("${req.body.login}", "${hash}", "${req.body.email}", "${code}", 0);`, (err, result) => {
                if(err){
                    res.sendStatus(500);
                    return;
                }

                //wyslij maila z kodem aktywacyjnym
                transporter.sendMail(mailOpt, (err, info) => {
                    if (err) {
                        //blad przy wysylaniu maila
                        res.sendStatus(500);
                        return
                    }
                    res.status(201).json({msg: 'account created'});
                });
            });
        });
    });
});



//aktywacja konta req = {email : string, code : string}
router.patch('/activate', (req, res) => {
    //pobierz informacje o koncie z bazy
    con.get(`SELECT activation_code, is_activated FROM users WHERE email = "${req.body.email}";`, (err, row) => {
        if(err){
            res.sendStatus(500);
            return;
        }
        if(!row){
            //konto nie istnieje
            res.status(404).json({msg: 'account not found'});
            return;
        }
        if(row.is_activated != 0){
            //konto zostalo juz aktywowane
            res.status(409).json({msg: 'account already active'});
            return;
        }
        if(req.body.code != row.activation_code){
            //kod aktywacyjny sie nie zgadza, wygeneruj nowy kod
            let code = codeGenerator(5);
            //zaktualizuj kod w bazie danych
            con.run(`UPDATE users SET activation_code = "${code}" WHERE email = "${req.body.email}";`, (err, resp) => {
                if(err){
                    res.sendStatus(500);
                    return;
                }
                //informacje potrzebne do wyslania maila
                let mailOpt = mailOptions(process.env.EMAIL_ADDR, req.body.email, 'kod aktywacyjny', `twój kod aktywacyjny dla twojego konta to ${code}.`);
                //wyslij nowego maila z kodem
                transporter.sendMail(mailOpt, (err, info) => {
                    if(err){
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                    //wyslij informacje o niepoprawnym kodzie aktywacyjnym
                    res.status(406).json({msg: 'invalid code'});
                    return;
                });
            });
        }
        else{
            //kod sie zgadza, aktyywuj konto
            con.run(`UPDATE users SET is_activated = 1 WHERE email = "${req.body.email}";`, (err, resp) => {
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                res.status(200).json({msg: 'account activated'});
            });
        }
    });
});

//logowanie req = {email : string, password : string}
router.get('/login', (req, res) => {
    //pobranie informacji o koncie z bazy danych
    con.get(`SELECT login, password, is_activated FROM users WHERE email = "${req.body.email}";`, (err, row) => {
        if(err){
            res.sendStatus(500);
            return;
        }
        if(!row){
            //konto nie istnieje
            res.status(404).json({msg: 'account not found'});
            return;
        }
        if(row.is_activated != 1){
            //konto nie zostalo aktywowane
            res.status(403).json({msg: 'account not active'});
            return;
        }
        bcrypt.compare(req.body.password, row.password, (err, match) => {
            if(err){
                res.sendStatus(500);
                return;
            }
            if(!match){
                //niepoprawne haslo
                res.status(200).json({msg: 'invalid password'});
                return;
            }
            // haslo sie zgadza
            req.session.login = row.login;
            res.status(200).json({msg: 'ok', login: row.login});
        });
    });

});

router.get('/loggedin', (req, res) => {
    if(req.session.login){
        return res.status(200).json({login: req.session.login});
    }
    return res.status(404).json({msg: 'not logged in'});
});

router.get('/logout', (req, res) => {
    if(req.session.login){
        req.session.destroy();
        return res.status(200).json({msg: 'logged out'});
    }
    return res.status(404).json({msg: 'not logged in'});
});

module.exports = router;