"use strict";
require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const distance = require('./distance.js');
const types = require('./db/types.json').types;

let date = Date.now();
// funkcja generujaca unikalne nazwy dla plikow
const getFilename = (file) => {
    return ++date + path.extname(file.originalname);
};

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'pictures/');
        },
        filename: function (req, file, cb) {
            cb(null, getFilename(file));
        }
    }),
    limits: {
        fileSize: 4 * 1024 * 1024,
        files: 8
    }
});


const con = require('./dbCon.js');
const authorize = (req, res, next) => {
    if(!req.session.user_id){
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
//req = {title : string, description : string, category : int, pictures : file[], lat : float, lng : float, type : string, coat : string, color : string, breed : string}
//category = 0 - ogłoszenie zaginiecia, category = 1 - ogloszenie znalezienia
//lat - szerokosc geograficzna w stopniach
//lng - dlugosc geograficzna w stopniach
//type - typ zwierzecia (pies, kot, gad itp.)
//coat - owłosienie - niewymagane
//color - umaszczenie   - niewymagane
//breed - rasa - niewymagane
router.post('/', upload.array('pictures'), (req, res) => {
    //brakuje ktoregos z niezbednych pol lub ktores z pol zawiera niepoprawne dane - ogloszenie nie moze zostac dodane
    if(!(req.body.title && req.body.description && req.body.category && req.body.lat && req.body.lng && req.body.type) || 
    (req.body.category != 0 && req.body.category != 1) || isNaN(parseFloat(req.body.lat)) || isNaN(parseFloat(req.body.lng))){
        //ogloszenie nie zostanie dodane - kasujemy powiazane z nim zdjecia
        req.files.forEach((e) => {
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

    //dodanie ogloszenia
    con.run('INSERT INTO anons(title, description, category, images, author_id, create_date, lat, lng, type, coat, color, breed) VALUES(?, ?, ?, ?, ?, (SELECT strftime ("%s", "now")), ?, ?, ?, ?, ?, ?);', 
    req.body.title, req.body.description, req.body.category, pictures, req.session.user_id, req.body.lat, req.body.lng, req.body.type, req.body.coat, req.body.color, req.body.breed, function(err){
        if(err){
            console.log(err);
            //dodanie ogloszenia sie nie powiodlo - kasujemy powiazane z nim zdjecia
            req.files.forEach((e) => {
                fs.unlink('./pictures/' + e.filename, (err) => {
                    if(err){
                        console.log(err);
                    }
                });
            });
            return res.sendStatus(500);
        }
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
            lng: row.lng,
            type: row.type,
            coat: (row.coat == null ? undefined : row.coat),
            color: (row.color == null ? undefined : row.color),
            breed: (row.breed == null ? undefined : row.breed)
        });
    });
});


// zwraca liste ogloszen sortowana po dacie utworzenia malejaco i liczbe przeslanych ogloszen
// parametry: page, num, category, type, coat, color, breed, lat, lng, rad
// parametr page informuje, ktora strone ogloszen zwrocic
// parametr num informuje, ile ogloszen ma przypadac na strone
// jesli parametr num jest niezdefiniowany, przyjmuje wartosc 30
// jesli parametr page jest niezdefiniowany, to zwracane sa wszystkie ogloszenia
// category, type, coat, color, breed pozwalaja filtrowac ogloszenia
// jesli ktorys z tych parametrow zostanie pominiety, oznacza to, ze wlasciwosc ta moze byc dowolna (w tym niezdefiniowana)
// jesli wlasciwosc moze przyjac kilka wartosci, nalezy ja podac po przecinku (wartosc1,wartosc2,...)
// jesli lat lub lng nie jest podany, ignorowane sa oba
// w przeciwnym wypadku zwracane sa tylko ogloszenia oddalone od punktu (lat, lng) o rad kilometrow
// jesli rad nie jest zdefiniowany, przyjmuje wartosc 30
router.get('/list', (req, res) => {
    // filtry do zapytania
    let filters = [];
    // wartosci filtrow
    let parameters = [];
    // dodawanie filtrow i ich wartosci
    if(req.query.category == 1 || req.query.category == 0){
        filters.push('category = ?');
        parameters.push(req.query.category);
    }
    if(req.query.type){
        filters.push('type IN (' + Array(req.query.type.split(',').length).fill('?').join(', ') + ')');
        req.query.type.split(',').forEach((e) => {parameters.push(e);});
    }
    if(req.query.coat){
        filters.push('coat IN (' + Array(req.query.coat.split(',').length).fill('?').join(', ') + ')');
        req.query.coat.split(',').forEach((e) => {parameters.push(e);});
    }
    if(req.query.color){
        filters.push('color IN (' + Array(req.query.color.split(',').length).fill('?').join(', ') + ')');
        req.query.color.split(',').forEach((e) => {parameters.push(e);});
    }
    if(req.query.breed){
        filters.push('breed IN (' + Array(req.query.breed.split(',').length).fill('?').join(', ') + ')');
        req.query.breed.split(',').forEach((e) => {parameters.push(e);});
    }    

    let statement = 'SELECT id, title, category, images image, lat, lng, type FROM anons' + 
    (filters.length > 0 ? ' WHERE ' : '') + filters.join(' AND ') + ' ORDER BY create_date DESC;'

    // dane odsylane do klienta
    let arr = [];
    con.each(statement, parameters, (err, row) => {
        if(err){
            console.log(err);
            throw err;
        }
        // zdefiniowano parametry lat i lng - odfiltrowujemy zbyt oddalone ogloszenia
        if(!isNaN(parseFloat(req.query.lat)) && !isNaN(parseFloat(req.query.lng))){
            if(!(distance({lat: req.query.lat, lng: req.query.lng}, {lat: row.lat, lng: row.lng}) > (isNaN(parseInt(req.query.rad))) ? 30000 : req.query.rad * 1000)){
                arr.push(row);
            }
        }
        else{
            arr.push(row);
        }
    }, (err, number) => {
        if(err){
            console.log(err);
            throw err;
        }
        
        // jesli zdefiniowano page, wysylamy tylko ogloszenia z okreslonego zakresu
        if(!isNaN(parseInt(req.query.page)) && parseInt(req.query.page) > 0){
            const num = (!isNaN(parseInt(req.query.num)) && parseInt(req.query.num) > 0 ? req.query.num : 30);
            arr = arr.filter((e, i) => {return (i < num * req.query.page) && (i >= num * (req.query.page - 1));})
        }

        // nazwy zdjec sa przechowywane w nastepujacym formacie: nazwa1#nazwa2#...#nazwan
        arr.forEach((e, i) => {
            arr[i].image = e.image.split('#')[0];
        });

        return res.status(200).json({
            num: arr.length,
            list: arr
        });
    });   
});


//aktualizuje informacje o ogloszeniu o podanym id - użytkownik musi być zalogowany i byc autorem ogloszenia
//req = {id : int, title : string, description : string, category : int, pictures : file[], lat : float, lng : float, type : string, coat : string, color : string, breed : string}
router.put('/', upload.array('pictures'), (req, res) => {
    //brakuje ktoregos z niezbednych pol lub ktores z pol zawiera niepoprawne dane - ogloszenie nie moze zostac zaktualizowane
    if(!(req.body.id && req.body.title && req.body.description && req.body.category && req.body.lat && req.body.lng && req.body.type) || 
    (req.body.category != 0 && req.body.category != 1) || isNaN(parseFloat(req.body.lat)) || isNaN(parseFloat(req.body.lng))){
        req.files.forEach((e) => {
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
        con.run('UPDATE anons SET title = ?, description = ?, category = ?, images = ?, lat = ?, lng = ?, type = ?, coat = ?, color = ?, breed = ? WHERE id = ?;', 
        req.body.title, req.body.description, req.body.category, pictures, req.body.lat, req.body.lng, req.body.type, req.body.coat, req.body.color, req.body.breed, req.body.id, function(err){
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
        //uzytkownik nie jest autorem ogloszenia lub administratorem
        if((row.author_id != req.session.user_id) || (req.session.is_admin == 1)){
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
router.get('/my', (req, res) => {
    con.all('SELECT id, category, title, datetime(create_date, "unixepoch", "localtime") create_date, images image, type FROM anons WHERE author_id = ?', req.session.user_id, (err, rows) => {
        if(err){
            return res.sendStatus(500);
        }

        // nazwy zdjec sa przechowywane w nastepujacym formacie: nazwa1#nazwa2#...#nazwan
        rows.forEach((e, i) => {
            rows[i].image = e.image.split('#')[0];
        });

        return res.status(200).json({
            num: rows.length,
            list: rows
        });
    });
});


router.get('/types', (req, res) => {
    return res.status(200).json(types);
});


module.exports = router;
