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
const authorize = (req, res, next) => {
    if(!req.session.login){
        return res.sendStatus(401);
    }
    next();
}


// użytkownik musi być zalogowany, by móc dodawać, edytować lub usuwać ogłoszenia lub pobrac liste swoich ogloszen
router.post('/', authorize);
router.put('/', authorize);
router.delete('/', authorize);
router.get('/my', authorize);


//dodanie nowego ogloszenia o zaginionym zwierzeciu
//req = {title : string, description : string, category : int, pictures : file[], lat : float, lng : float}
//category = 0 - ogłoszenie zaginiecia, category = 1 - ogloszenie znalezienia
//lat - szerokosc geograficzna w stopniach
//lng - dlugosc geograficzna w stopniach
router.post('/', upload.array('pictures'), (req, res) => {
    console.log(req.body);
    console.log(req.files);

    //brakuje ktoregos z niezbednych pol lub ktores z pol zawiera niepoprawne dane - ogloszenie nie moze zostac dodane
    if(!(req.body.title && req.body.description && req.body.category && req.body.lat && req.body.lng) || 
    (req.body.category != 0 && req.body.category != 1) || isNaN(parseFloat(req.body.lat)) || isNaN(parseFloat(req.body.lng))){
        //ogloszenie nie zostanie dodane - kasujemy powiazane z nim zdjecia
        req.files.forEach((e) => {
            console.log(e);
            fs.unlink('./pictures/' + e.filename, (err) => {
                if(err){
                    console.log(err);
                }
            });
        });
        return res.status(400).json({msg: 'required field is empty/contain invalid data'});
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
            //dodanie ogloszenia sie nie powiodlo - kasujemy powiazane z nim zdjecia
            req.files.filename.forEach((e) => {
                fs.unlink('./pictures/' + e.filename, (err) => {
                    if(err){
                        console.log(err);
                    }
                });
            });
            return res.sendStatus(500);
        }
        console.log(this.lastID);
        return res.status(200).json({id: this.lastID});
    });
});


//wysyla obrazek o nazwie podanej w parametrze name gdy plik istnieje, lub 404 gdy nie istnieje
router.get('/photo', (req, res) => {
    fs.stat('./pictures/' + req.query.name, (err, stat) => {
        //plik nie istnieje
        if(err){
            return res.sendStatus(404);
        }
        //plik istnieje, wyslij go
        return res.sendFile(path.join(__dirname, './pictures', req.query.name));
    });
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


// zwraca liste ogloszen sortowana po dacie utworzenia malejaco i liczbe przeslanych ogloszen
// parametr page informuje ktora trzydziestke ogloszen ma zwrocic serwer tj.
// page = 1 - zwraca ogloszenia 1 - 30
// page = 2 - zwraca ogloszenia 31 - 60 itd.
// jesli parametr page jest niezdefiniowany, to zwraca ogloszenia 1 - 30
router.get('/list', (req, res) => {
    let page = (isNaN(parseInt(req.query.page)) ? 1 : req.query.page);
    con.all('SELECT id, title, category, create_date, image FROM (SELECT ROW_NUMBER() OVER (ORDER BY create_date DESC) row, id, category, title, datetime(create_date, "unixepoch", "localtime") create_date, images image FROM anons) WHERE row BETWEEN ? AND ?;', 1 + (page - 1) * 30, page * 30, (err, rows) => {
        if(err){
            return res.sendStatus(500);
        }
        // nazwy zdjec sa przechowywane w nastepujacym formacie: nazwa1#nazwa2#...#nazwan
        rows.forEach((e, i) => {rows[i].image = e.image.split('#')[0];});
        return res.status(200).json({
            num: rows.length,
            list: rows
        });
    });
});


//aktualizuje informacje o ogloszeniu o podanym id - użytkownik musi być zalogowany i byc autorem ogloszenia
//req = {id : int, title : string, description : string, category : int, pictures : file[], lat : float, lng : float}
router.put('/', upload.array('pictures'), (req, res) => {
    console.log(req.body);
    console.log(req.files);
    //brakuje ktoregos z niezbednych pol lub ktores z pol zawiera niepoprawne dane - ogloszenie nie moze zostac zaktualizowane
    if(!(req.body.id && req.body.title && req.body.description && req.body.category && req.body.lat && req.body.lng) || 
    (req.body.category != 0 && req.body.category != 1) || isNaN(parseFloat(req.body.lat)) || isNaN(parseFloat(req.body.lng))){
        req.files.filename.forEach((e) => {
            fs.unlink('./pictures/' + e.filename, (err) => {
                if(err){
                    console.log(err);
                }
            });
        });
        return res.status(400).json({msg: 'required field is empty/contain invalid data'});
    }
    con.get('SELECT author_id, images FROM anons WHERE id = ?;', req.body.id, (err, row) => {
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        //ogloszenie nie istnieje
        if(!row){
            return res.sendStatus(404);
        }
        //uzytkownik nie jest autorem ogloszenia
        if(row.author_id != req.session.user_id){
            return res.sendStatus(403);
        }

        //nowa lista nazw zdjec
        let pictures = '';
        req.files.forEach((e, i, arr) => {
            pictures += e.filename;
            if(i < arr.length - 1){
                pictures += '#';
            }
        });

        //dodanie ogloszenia
        con.run('UPDATE anons SET title = ?, description = ?, category = ?, images = ?, lat = ?, lng = ? WHERE id = ?;', 
        req.body.title, req.body.description, req.body.category, pictures, req.body.lat, req.body.lng, req.body.id, function(err){
            if(err){
                //aktualizacja ogloszenia sie nie powiodlo - kasujemy powiazane z nim zdjecia
                req.files.filename.forEach((e) => {
                    fs.unlink('./pictures/' + e.filename, (err) => {
                        if(err){
                            console.log(err);
                        }
                    });
                });
                return res.sendStatus(500);
            }
            //usuwamy stare zdjecia
            if(row.images.length > 0){
                row.images.split('#').forEach((e) => {
                    fs.unlink('./pictures/' + e, (err) => {
                        if(err){
                            console.log(err);
                        }
                    });
                });
            }
            console.log("hwdp " + this.lastID);
            return res.sendStatus(200);
        });
    });
});


//usuwa ogloszenie o podanym id - użytkownik musi być zalogowany i byc autorem ogloszenia
//req = {id : int}
router.delete('/', (req, res) => {
    con.get('SELECT images, author_id FROM anons WHERE id = ?;', req.body.id, (err, row) => {
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        //ogloszenie nie istnieje
        if(!row){
            return res.sendStatus(404);
        }
        //uzytkownik nie jest autorem ogloszenia
        if(row.author_id != req.session.user_id){
            return res.sendStatus(403);
        }
        //usun ogloszenie z bazy
        con.run('DELETE FROM anons WHERE id = ?', req.body.id, (err) => {
            if(err){
                console.log(err);
                return res.sendStatus(500);
            }
            return res.sendStatus(200);
        }); 
        //jesli ogłoszenie mialo jakies zdjecia - usun je
        if(row.images.length > 0){
            row.images.split('#').forEach((e) => {
                fs.unlink('./pictures/' + e, (err) => {
                    if(err){
                        console.log(err);
                    }
                });
            });
        }  
    });
});


// zwraca liste ogloszen utworzonych przez uzytkownika sortowana po dacie utworzenia malejaco i liczbe przeslanych ogloszen
// parametr page informuje ktora trzydziestke ogloszen ma zwrocic serwer tj.
// page = 1 - zwraca ogloszenia 1 - 30
// page = 2 - zwraca ogloszenia 31 - 60 itd.
// jesli parametr page jest niezdefiniowany, to zwraca ogloszenia 1 - 30
router.get('/my', (req, res) => {
    let page = (isNaN(parseInt(req.query.page)) ? 1 : req.query.page);
    con.all('SELECT id, title, category, create_date, image FROM (SELECT ROW_NUMBER() OVER (ORDER BY create_date DESC) row, id, category, title, datetime(create_date, "unixepoch", "localtime") create_date, images image FROM anons WHERE author_id = ?) WHERE row BETWEEN ? AND ?', req.session.user_id, 1 + (page - 1) * 30, page * 30, (err, rows) => {
        if(err){
            return res.sendStatus(500);
        }
        // nazwy zdjec sa przechowywane w nastepujacym formacie: nazwa1#nazwa2#...#nazwan
        rows.forEach((e, i) => {rows[i].image = e.image.split('#')[0];});
        return res.status(200).json({
            num: rows.length,
            list: rows
        });
    });
});


module.exports = router;
