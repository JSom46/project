"use strict";
require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const distance = require('./distance.js');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'pictures/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 4 * 1024 * 1024,
        files: 8
    }
});

const con = require('./dbCon.js');


// przed dodaniem ogloszenia, sprawdza, czy uzytkownik jest zalogowany, jesli nie, zwraca blad 401
router.post('/add', (req, res, next) => {/*
    if(!req.session.login){
        return res.status(401).json({msg: 'not logged in'});
    }*/
    next();
});


//dodanie nowego ogloszenia o zaginionym zwierzeciu
//req = {title : string, description : string, category : int, pictures : file[], lat : float, lng : float}
//category = 0 - ogłoszenie zaginiecia, category = 1 - ogloszenie znalezienia
//lat - szerokosc geograficzna w stopniach
//lng - dlugosc geograficzna w stopniach
router.post('/add', upload.array('pictures'), (req, res) => {
    console.log(req.body);
    console.log(req.files);

    //brakuje ktoregos z niezbednych pol lub ktores z pol zawiera niepoprawne dane - ogloszenie nie moze zostac dodane
    if(!(req.body.title && req.body.description && req.body.category && req.body.lat && req.body.lng) || 
    (req.body.category != 0 && req.body.category != 1) || 
    isNaN(parseFloat(req.body.lat)) || isNaN(parseFloat(req.body.lng))){
        console.log('blad ez!');
        // usuniecie zdjec przeslanych z ogloszeniem

        return res.status(400).json({msg: 'required field is empty'});
    }

    //utworzenie listy zdjec
    let pictures = '';
    req.files.forEach((e, i, arr) => {
        pictures += e.filename;
        if(i < arr.length - 1){
            pictures += '#';
        }
    });
    console.log(pictures);
    req.session.user_id = 69;

    //dodanie ogloszenia
    con.run('INSERT INTO anons(title, description, category, images, author_id, create_date, lat, lng) VALUES(?, ?, ?, ?, ?, (SELECT strftime ("%s", "now")), ?, ?);', 
    req.body.title, req.body.description, req.body.category, pictures, req.session.user_id, req.body.lat, req.body.lng, function(err){
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        console.log(this.lastID);
        return res.status(200).json({id: this.lastID});
    });
});


//wysyla obrazek o nazwie podanej w parametrze name gdy plik istnieje, lub 404 gdy nie istnieje
router.get('/photo', (req, res) => {
    if (fs.existsSync('./pictures/' + req.query.name)){
        //return res.sendFile('./pictures/' + req.query.name);
        return res.sendFile(path.join(__dirname, './pictures', req.query.name));
    }
    return res.sendStatus(404);
});


//wysyla informacje o ogloszeniu o id podanym w parametrze id
router.get('/', (req, res) => {
    con.get('SELECT * FROM anons WHERE id = ?', req.query.id, (err, row) => {
        if(err){
            return res.sendStatus(500);
        }
        if(!row){
            return res.sendStatus(404);
        }
        return res.status(200).json({
            id: row.id, 
            title: row.title, 
            description: row.description, 
            category: row.category, 
            images: row.images.split('#'), 
            author_id: row.author_id, 
            create_date: row.create_date, 
            lat: row.lat, 
            lng: row.lng});
    });
});


//zwraca liste ogloszen o zadanych, opcjonalnych parametrach: 
//category = 0 - ogłoszenia zaginiecia, 1 - ogloszenia znalezienia, brak - wszystkie ogloszenia
//lat, lng - ogloszenia oddalone od punktu (lat, lng) o nie wiecej niz range kilometrow. jesli lat lub lng nie jest podane, jest to pomijane
//range - jesli pominiety, domyslnie przyjmuje wartosc 10
//sortby = 'date' - ogloszenia sortowane po dacie dodania, 'dist' - ogloszenia sortowane po odleglosci od punktu (lat, lng) - jesli nie podano, ogloszenia sortowane po dacie dodania

/*router.get('/list', (req, res) => {
    let options = {};
    options.sortby = (req.query.sortby == 'dist' && !isNaN(parseFloat(req.query.lat)) && !isNaN(parseFloat(req.query.lng)) ? 'dist' : 'date');
    options.category = (req.query.category == 0 || req.query.category == 1 ? req.query.category : undefined);
    options.range = (req.query.lat && req.query.lng ? (parseFloat(req.query.range) ? parseFloat(req.query.range) : 10) : undefined)

    let arr = {};

    if(!range){
        con.all('SELECT id, title, category, images, lat, lng' + (options.category ? ' WHERE category = ' + options.category : '') + ' SORT BY create_date DSC;', (err, rows) => {
            if(err){
                res.sendStatus(500);
            }
            if(sortby == 'dist'){
                rows.sort((a, b) => {distance(a, {lat: req.query.lat, lng: req.query.lng}) - distance(b, {lat: req.query.lat, lng: req.query.lng})});
            }
        });
    }

    try{
        con.each('SELECT id, title, category, images, lat, lng' + (options.category ? ' WHERE category = ' + options.category : '') + ' SORT BY create_date DSC;', (err, row) => {
            if(err){
                throw err;
            }

        });
    } catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
});*/

module.exports = router;
