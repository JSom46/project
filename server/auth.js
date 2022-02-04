"use strict";

require('dotenv').config();
const bcrypt = require('bcrypt');
const codeGenerator = require('./codeGenerator.js');
const mailOptions = require('./mailOptions');
const express = require('express');

const googleAuthURL = require('./googleAuth.js').getGoogleAuthURL;
const getGoogleUser = require('./googleAuth.js').getGoogleUser;
const getFacebookAuthURL = require('./facebookAuth.js').getFacebookAuthURL
const getFacebookUser = require('./facebookAuth.js').getFacebookUser;
const passwordValidator = require('./passwordValidator.js');

const router = express.Router();

const nodemailer = require("nodemailer");
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



//rejestracja req = {login : string, password : string, email : string}
router.post('/signup', (req, res) => {
	console.log(req.body);
    //sprawdzenie, czy mail nie jest już w uzyciu
    con.get(`SELECT "x" FROM users WHERE email = ?;`, req.body.email, (err, row) => {
        if(err){
            return res.sendStatus(500);
        }
        if(row){
            //email jest juz w uzyciu
            return res.status(400).json({msg: 'email already in use'});
        }
        //email jest wolny, sprawdz zlozonosc hasla
        const passwdValidation = passwordValidator(req.body.password);
        if(!passwdValidation.isValid){
            return res.status(400).json({msg: 'password too weak', err: passwdValidation.errors});
        }
        //haslo jest dostatecznie silne, zaszyfruj je
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err){
                return res.sendStatus(500);
            }

            //wygeneruj kod aktywacyjny i sprawdź jego unikalność. wygeneruj nowy jesli nie jest unikalny
            let code;
            let isUnique = true;
            do{
                code = codeGenerator(64);
                con.get(`SELECT COUNT(*) FROM users WHERE is_activated = 0 AND activation_code = ?`, code, (err, result) => {
                    if(err){
                        return res.sendStatus(500);
                    }
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
                'kod aktywacyjny', 
                `${req.body.login}, aktywuj swoje konto klikając w link poniżej:\n localhost:3000/activate?code=${code}`);

            //dodaj usera do bazy
            con.run(`INSERT INTO users (login, password, email, activation_code, is_activated, is_native) 
            VALUES (?, ?, ?, ?, 0, 1);`, req.body.login, hash, req.body.email, code, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }

                //wyslij maila z kodem aktywacyjnym
                transporter.sendMail(mailOpt, (err, info) => {
                    if (err) {
                        //blad przy wysylaniu maila
                        return res.sendStatus(500);
                    }
                    res.status(201).json({msg: 'account created'});
                });
            });
        });
    });
});

//aktywacja konta req = {code : string}
router.post('/activate', (req, res) => {
    // sprawdz, czy istnieje nieaktywowane konto z podanym kodem
    con.get(`SELECT * FROM users WHERE is_activated = 0 AND activation_code = ?`, req.body.code, (err, row) => {
        if(err){
            return res.sendStatus(500);
        }
        // brak takiego konta, zwroc informacje o niewlasciwym kodzie
        if(!row){           
            return res.status(400).json({msg: 'invalid code'});
        }
        // konto istanieje, aktywuj je
        con.run(`UPDATE users SET is_activated = 1 WHERE is_activated = 0 AND activation_code = ?`, req.body.code, (err, info) => {
            if(err){
                return res.sendStatus(500);
            }
            res.status(200).json({msg: 'account activated'});
        });
    });
});



//logowanie req = {email : string, password : string}
router.post('/login', (req, res) => {
    //pobranie informacji o koncie z bazy danych
    if(req.session.login){
        return res.status(400).json({msg: 'already logged in'});
    }
    con.get(`SELECT login, password, is_activated, is_native FROM users WHERE email = ?;`, req.body.email, (err, row) => {
        if(err){
            return res.sendStatus(500);
        }
        if(!row){
            //konto nie istnieje
            return res.status(400).json({msg: 'account not found'});
        }
        if(row.is_activated != 1){
            //konto nie zostalo aktywowane
            return res.status(400).json({msg: 'account not active'});
        }
        if(row.is_native != 1){
            //konto wymagania zewnetrznego uwierzytelnienia
            return res.status(400).json({msg: 'account require external authentication'})
        }
        bcrypt.compare(req.body.password, row.password, (err, match) => {
            if(err){
                return res.sendStatus(500);
            }
            if(!match){
                //niepoprawne haslo
                return res.status(400).json({msg: 'invalid password'});
            }
            // haslo sie zgadza
            req.session.login = row.login;
            return res.status(200).json({msg: 'ok', login: row.login});          
        });
    });

});



//zwraca link do autoryzacji przy pomocy google req = {type : string}
// jeśli type = 'web' po zalogowaniu nastąpi przekierowanie do strony glownej aplikacji webowej
router.get('/google/url', (req, res) => {
    if(req.query.type == 'web'){
        req.session.type = 'web';
    }
    return res.status(200).json({url: googleAuthURL()});
});



//pomyślna autoryzacja przy pomocy google przekieruje tutaj, tworzy konto(jesli to pierwsze logowanie przy pomocy danego konta) i tworzy sesje
router.get('/google', async (req, res) => {
    const code = req.query.code;
    //pobranie informacji o uzytkowniku
    const user = await getGoogleUser({code});
    //sprawdzenie czy konto juz istnieje
    con.get(`SELECT * FROM users WHERE email = ?;`, user.email, (err, row) => {
        if(err){
            return res.sendStatus(500);
        }
        //konto nie istnieje - utworzenie nowego konta przy pomocy pobranych danych
        if(!row){
            con.run(`INSERT INTO users(login, password, email, is_activated, is_native) VALUES (?, ?, ?, 1, 0);`, user.name, user.id, user.email, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                req.session.login = user.name;
                return res.status(200).json({msg: 'ok', login: user.name});
            });
        }
        //konto istnieje - utworzenie sesji
        else{
            req.session.login = user.name;
            if(req.session.type == 'web'){
                req.session.type = null;
                return res.redirect(301, 'http://localhost:3000');
            }
            return res.status(200).json({msg: 'ok', login: user.name});
        }
    });
});



//zwraca link do autoryzacji przy pomocy facebooka req = {type : string}
// jeśli type = 'web' po zalogowaniu nastąpi przekierowanie do strony glownej aplikacji webowej
router.get('/facebook/url', (req, res) => {
    if(req.query.type == 'web'){
        req.session.type = 'web';
    }
    return res.status(200).json({url: getFacebookAuthURL()});           
});



//pomyślna autoryzacja przy pomocy facebooka przekieruje tutaj, tworzy konto(jesli to pierwsze logowanie przy pomocy danego konta) i tworzy sesje
router.get('/facebook', async (req, res) => {
    const code = req.query.code;
    const user = await getFacebookUser(code);
    //sprawdzenie, czy konto istnieje
    con.get('SELECT * FROM users WHERE email = ?;', user.email, (err, row) => {
        if(err){
            return res.sendStatus(500);
        }
        //konto nie istnieje - utworzenie nowego konta przy pomocy pobranych danych
        if(!row){
            con.run('INSERT INTO users(login, password, email, is_activated, is_native) VALUES(?, ?, ?, 1, 0);', user.name, user.id, user.email, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                req.session.login = user.name;
                return res.status(200).json({msg: 'ok', login: user.name});
            });
        }
        //konto istnieje - utworzenie sesji
        else{
            req.session.login = user.name;
            if(req.session.type == 'web'){
                req.session.type = null;
                return res.redirect(301, 'http://localhost:3000');
            }
            return res.status(200).json({msg: 'ok', login: user.name});
        }
    });
});



//zwraca login, jesli user jest zalogowany i informacje ze nie jest zalogowany w przeciwnym wypadku
router.get('/loggedin', (req, res) => {
    if(req.session.login){
        return res.status(200).json({login: req.session.login});
    }
    return res.status(403).json({msg: 'not logged in'});
});



//niszczy sesje jest user byl zalogowany i informacje ze nie jest zalogowany w przeciwnym wypadku
router.get('/logout', (req, res) => {
    if(req.session.login){
        req.session.destroy();
        return res.status(200).json({msg: 'logged out'});
    }
    return res.status(403).json({msg: 'not logged in'});
});



module.exports = router;