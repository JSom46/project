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

const con = require('./dbCon.js');


//rejestracja req = {login : string, password : string, email : string}
router.post('/signup', (req, res) => {
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
                    if(result != 0){
                        isUnique = false;
                    }
                });
            } while(!isUnique)

            //informacje potrzebne do wyslania maila
            let mailOpt = mailOptions(
                process.env.EMAIL_ADDR, 
                req.body.email, 
                'Aktywuj swoje konto', 
                `${req.body.login}, aktywuj swoje konto klikając w link poniżej:\n ${process.env.WEB_APP_ROOT_URI}/activate?code=${code}`);

            //dodaj usera do bazy
            con.run(`INSERT INTO users (login, password, email, activation_code, is_activated, is_native, is_admin) 
            VALUES (?, ?, ?, ?, 0, 1, 0);`, req.body.login, hash, req.body.email, code, (err, result) => {
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
        // konto istnieje, aktywuj je
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
    con.get(`SELECT * FROM users WHERE email = ?;`, req.body.email, (err, row) => {
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
            req.session.user_id = row.id;
            req.session.email = row.email;
            req.session.is_admin = row.is_admin;
            return res.status(200).json({msg: 'ok', login: row.login, email: row.email, user_id: row.id, is_admin: row.is_admin});          
        });
    });

});


//zwraca link do autoryzacji przy pomocy google req = {}
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
            con.run(`INSERT INTO users(login, password, email, is_activated, is_native, is_admin) VALUES (?, ?, ?, 1, 0, 0);`, user.name, user.id, user.email, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                con.get('SELECT id FROM users WHERE email = ?;', user.email, (err, row) => {
                    req.session.login = user.name;
                    req.session.email = user.email;
                    req.session.user_id = row.id;
                    req.session.is_admin = 0;

                    if(req.session.type == 'web'){
                        req.session.type = undefined;
                        return res.redirect(301, process.env.WEB_APP_ROOT_URI);
                    }

                    return res.status(200).json({msg: 'ok', login: user.name, email: user.email, user_id: row.id, is_admin: 0});  
                });
            });
        }
        //konto istnieje - utworzenie sesji
        else{
            req.session.login = row.login;
            req.session.user_id = row.id;
            req.session.email = row.email;
            req.session.is_admin = row.is_admin;

            if(req.session.type == 'web'){
                req.session.type = undefined;
                return res.redirect(301, process.env.WEB_APP_ROOT_URI);
            }

            return res.status(200).json({msg: 'ok', login: user.name, email: user.email, user_id: row.id, is_admin: row.is_admin});
        }
    });
});


//zwraca link do autoryzacji przy pomocy facebooka req = {}
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
            con.run('INSERT INTO users(login, password, email, is_activated, is_native, is_admin) VALUES(?, ?, ?, 1, 0, 0);', user.name, user.id, user.email, function(err){
                if(err){
                    return res.sendStatus(500);
                }

                req.session.login = user.name;
                req.session.email = user.email;
                req.session.user_id = this.lastID;
                req.session.is_admin = 0;

                if(req.session.type == 'web'){
                    req.session.type = undefined;
                    return res.redirect(301, process.env.WEB_APP_ROOT_URI);
                }

                return res.status(200).json({msg: 'ok', login: user.name, email: user.email, user_id: this.lastID, is_admin: 0});   
            });
        }
        //konto istnieje - utworzenie sesji
        else{
            req.session.login = row.login;
            req.session.user_id = row.id;
            req.session.email = row.email;
            req.session.is_admin = row.is_admin;

            if(req.session.type == 'web'){
                req.session.type = undefined;
                return res.redirect(301, process.env.WEB_APP_ROOT_URI);
            }

            return res.status(200).json({msg: 'ok', login: row.login, email: row.email, user_id: row.id, is_admin: row.is_admin});
        }
    });
});


//zwraca id, login i email zalogowanego usera, lub informacje o niezalogowaniu
router.get('/loggedin', (req, res) => {
    if(req.session.login){
        return res.status(200).json({user_id: req.session.user_id, email: req.session.email, login: req.session.login, is_admin: req.session.is_admin});
    }
    return res.status(403).json({msg: 'not logged in'});
});


//niszczy sesje jesli user byl zalogowany lub wysyla informacje ze nie jest zalogowany w przeciwnym wypadku
router.get('/logout', (req, res) => {
    if(req.session.login){
        req.session.destroy();
        return res.status(200).json({msg: 'logged out'});
    }
    return res.status(403).json({msg: 'not logged in'});
});


//zwraca informacje o uzytkowniku o id rownym parametrowi id, jesli nie podano id,to zwraca informacje o zalogowanym uzytkowniku lub blad 403, jesli nie podano id i klient jest niezalogowany
router.get('/user', (req, res) => {
    if(req.query.id){
        //podano id
        con.get('SELECT id, login, email, is_admin FROM users WHERE id = ?;', req.query.id, (err, row) => {
            if(err){
                return res.sendStatus(500);
            }
            if(!row){
                //brak konta o podanym id
                return res.sendStatus(404);
            }
            return res.status(200).json({user_id: row.id, email: row.email, login: row.login, is_admin: row.is_admin});
        });
    }
    else if(req.session.user_id){
        //nie podano id, ale klient jest zalogowany
        return res.status(200).json({user_id: req.session.user_id, email: req.session.email, login: req.session.login, is_admin: req.session.is_admin});
    }
    //nie podano id i klient nie jest zalogowany
    return res.sendStatus(403);
});


module.exports = router;
