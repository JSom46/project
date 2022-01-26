"use strict";

require('dotenv').config();
const bcrypt = require('bcrypt');
const codeGenerator = require('./codeGenerator.js');
const mailOptions = require('./mailOptions');
const express = require('express');

const getGoogleUser = require('./googleAuth.js').getGoogleUser;
const googleAuthURL = require('./googleAuth.js').getGoogleAuthURL;
const getFacebookAuthURL = require('./facebookAuth.js').getFacebookAuthURL
const getFacebookUser = require('./facebookAuth.js').getFacebookUser;
const passwordValidator = require('./passwordValidator.js');

const router = express.Router();

const nodemailer = require("nodemailer");
const session = require('express-session');
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_ADDR,
        pass: process.env.EMAIL_PASSWD
    }
});

const sqlite3 = require('sqlite3').verbose();
const con = new sqlite3.Database('./db/serverdb.db', (err) => {
    if(err){
		console.log('db connecting error!');
		throw err;
	}
	console.log('connected succesfully to database!');
});
con.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, login TEXT NOT NULL, password TEXT NOT NULL, email TEXT UNIQUE NOT NULL, activation_code TEXT, is_activated INTEGER, is_native INTEGER);', (err, res) => {
    if(err){
        console.log(err.name + " | " + err.message);
        throw err;
    }
});

router.get('/signup', (req, res) => {
    return res.render('signup', {
        session: req.session
    });
});

router.post('/signup', (req, res) => {
    console.log(req.body);
    //sprawdzenie, czy mail nie jest już w uzyciu
    con.get(`SELECT "x" FROM users WHERE email = ?;`, req.body.email, (err, row) => {
        if(err){
            return res.render('error');
        }
        if(row){
            //email jest juz w uzyciu
            return res.render('error', {
                msg: 'email is already taken'
            });
        }
        //email jest wolny, sprawdz zlozonosc hasla
        const passwdValidation = passwordValidator(req.body.password);
        if(!passwdValidation.isValid){
            return res.render('error', {
                msg: 'password too weak',  
            });
        }
        //haslo jest dostatecznie silne, zaszyfruj je
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err){
                return res.render('error');
            }           

            //wygeneruj kod aktywacyjny i sprawdź jego unikalność. wygeneruj nowy jesli nie jest unikalny
            let code;
            let isUnique = true;

            do{
                code = codeGenerator(64);
                con.get(`SELECT COUNT(*) FROM users WHERE activation_code = ?`, code, (err, result) => {
                    console.log(result);
                    if(result != 0){
                        isUnique = false;
                    }
                });
            } while(!isUnique)

            //informacje potrzebne do wyslania maila
            let mailOpt = mailOptions(
                process.env.EMAIL_ADDR, 
                req.body.email, 
                'activate your account', 
                `${req.body.login}, activate your account by using the link below:\n localhost:2400/activate?code=${code}`
            );

            //dodaj usera do bazy
            con.run(`INSERT INTO users (login, password, email, activation_code, is_activated, is_native) 
            VALUES (?, ?, ?, ?, 0, 1);`, req.body.login, hash, req.body.email, code, (err, result) => {
                if(err){
                    return res.render('error');
                }

                //wyslij maila z kodem aktywacyjnym
                transporter.sendMail(mailOpt, (err, info) => {
                    if (err) {
                        //blad przy wysylaniu maila
                        return res.render('error');
                    }
                    res.render('signupSuccess', {
                        email: req.body.email,
                        session: req.session
                    });
                });
            });
        });
    });
});

router.get('/activate', (req, res) => {
    con.get(`SELECT * FROM users WHERE activation_code = ?`, req.query.code, (err, row) => {
        if(err){
            return res.render('error');
        }
        if(!row){
            return res.render('error', {
                msg: 'invalid code'
            });
        }
        if(row.is_activated != 0){
            return res.render('error', {
                msg: 'account already active'
            });
        }
        con.run(`UPDATE users SET is_activated = 1 WHERE activation_code = ?`, req.query.code, (err, info) => {
            if(err){
                console.log(err);
                return res.render('error');
            }
            return res.render('login', {
                session: req.session
            });
        });
    });
});

router.get('/login', (req, res) => {
    return res.render('login', {
        session: req.session,
        googleURL: googleAuthURL(),
        facebookURL: getFacebookAuthURL()
    });
});

router.post('/login', (req, res) => {
    con.get(`SELECT * FROM users WHERE email = ?`, req.body.email, (err, row) => {
        if(err){
            return res.render('error');
        }
        if(!row){
            return res.render('error', {
                msg: 'account does not exist'
            });
        }
        if(row.is_activated != 1){
            return res.render('error', {
                msg: 'account not activated'
            });
        }
        if(row.is_native != 1){
            return res.render('error', {
                msg: 'account require external authentication'
            });
        }
        bcrypt.compare(req.body.password, row.password, (err, match) => {
            if(err){
                return res.render('error');
            }
            if(!match){
                //niepoprawne haslo
                return res.render('error', {
                    msg: 'password invalid'
                });
            }
            // haslo sie zgadza
            req.session.login = row.login;
            return res.writeHead(301, {
                Location: `http://localhost:2400`
            }).end();
        });
    });
});

router.get('/facebook', async (req, res) => {
    const code = req.query.code;
    const user = await getFacebookUser(code);
    //sprawdzenie, czy konto istnieje
    con.get('SELECT * FROM users WHERE email = ?;', user.email, (err, row) => {
        if(err){
            return res.render('error');
        }
        //konto nie istnieje - utworzenie nowego konta przy pomocy pobranych danych
        if(!row){
            con.run('INSERT INTO users(login, password, email, is_activated, is_native) VALUES(?, ?, ?, 1, 0);', user.name, user.id, user.email, (err, result) => {
                if(err){
                    return res.render('error');
                }
                req.session.login = user.name;
                return res.writeHead(301, {
                    Location: `/`
                }).end();
            });
        }
        //konto istnieje - utworzenie sesji
        else{
            req.session.login = user.name;
            return res.writeHead(301, {
                Location: `/`
            }).end();
        }
    });
});

router.get('/google', async (req, res) => {
    const code = req.query.code;
    //pobranie informacji o uzytkowniku
    const user = await getGoogleUser({code});
    //sprawdzenie czy konto juz istnieje
    con.get(`SELECT * FROM users WHERE email = ?;`, user.email, (err, row) => {
        if(err){
            return res.render('error');
        }
        //konto nie istnieje - utworzenie nowego konta przy pomocy pobranych danych
        if(!row){
            con.run(`INSERT INTO users(login, password, email, is_activated, is_native) VALUES (?, ?, ?, 1, 0);`, user.name, user.id, user.email, (err, result) => {
                if(err){
                    return res.render('error');
                }
                req.session.login = user.name;
                return res.writeHead(301, {
                    Location: `/`
                }).end();
            });
        }
        //konto istnieje - utworzenie sesji
        else{
            req.session.login = user.name;
            return res.writeHead(301, {
                Location: `/`
            }).end();
        }
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.writeHead(301, {
        Location: `/`
    }).end();
});

module.exports = router;