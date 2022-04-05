"use strict";
require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const distance = require('./distance.js');
const types = require('./db/types.json').types;
const log = require('loglevel');

let date = BigInt(Date.now());
// funkcja generujaca unikalne nazwy dla plikow
const getFilename = (file) => {
    return ++date + path.extname(file.originalname);
};

// przyjmuje wiele plikow
const upload = multer({
    storage: multer.diskStorage({
        // sciezka do miejsca zapisu plikow
        destination: (req, file, cb) => {
            cb(null, 'pictures/');
        },
        // funkcja nadajaca plikom nazwy
        filename: function (req, file, cb) {
            cb(null, getFilename(file));
        }
    }),
    // akceptowane sa tylko zdjecia
    fileFilter: function (req, file, cb) {
        let regexp = /image*/;
        if(!regexp.test(file.mimetype)) {
            cb(null, false);
        }
        else{
            cb(null, true);
        }              
    },
    // limit ilosci i rozmiaru plikow
    limits: {
        fileSize: 4 * 1024 * 1024,
        files: 8
    }
});

// przyjmuje pojedynczy plik
const singleUpload = multer({
    storage: multer.diskStorage({
        // sciezka do miejsca zapisu plikow
        destination: (req, file, cb) => {
            cb(null, 'pictures/');
        },
        // funkcja nadajaca plikom nazwy
        filename: function (req, file, cb) {
            cb(null, getFilename(file));
        }
    }),
    // akceptowane sa tylko zdjecia
    fileFilter: function (req, file, cb) {
        let regexp = /image*/;
        if(!regexp.test(file.mimetype)) {
            cb(null, false);
        }
        else{       
            cb(null, true);
        }
    },
    // limit ilosci i rozmiaru plikow
    limits: {
        fileSize: 4 * 1024 * 1024,
        files: 1
    }
});

const con = require('./dbCon.js');

const authorize = (req, res, next) => {
    if(!req.session.user_id){
        return res.sendStatus(401);
    }
    next();
}


// klient musi być zalogowany, by móc korzystać z poniższych endpointow
router.post('/', authorize);
router.put('/', authorize);
router.delete('/', authorize);
router.get('/my', authorize);
router.get('/notifications', authorize);
router.get('/notifications/count', authorize);
router.get('/activate', authorize);


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
    log.trace('/ : post\nfiles:', req.files, '\nbody:', req.body);
    //brakuje ktoregos z niezbednych pol lub ktores z pol zawiera niepoprawne dane - ogloszenie nie moze zostac dodane
    if(!(req.body.title && req.body.description && req.body.category && req.body.lat && req.body.lng && req.body.type) || 
    (req.body.category != 0 && req.body.category != 1) || isNaN(parseFloat(req.body.lat)) || isNaN(parseFloat(req.body.lng))){
        //ogloszenie nie zostanie dodane - kasujemy powiazane z nim zdjecia
        req.files.forEach((e) => {
            fs.unlink('./pictures/' + e.filename, (err) => {
                if(err){
                    log.error('unlink: ', err);
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
    con.run(`INSERT INTO anons(
                title, 
                description, 
                category, 
                images, 
                author_id, 
                create_date, 
                lat, 
                lng, 
                type, 
                coat, 
                color, 
                breed, 
                is_active) 
            VALUES(?, ?, ?, ?, ?, (SELECT strftime ("%s", "now")), ?, ?, ?, ?, ?, ?, 1);`, 
    req.body.title, req.body.description, req.body.category, pictures, req.session.user_id, req.body.lat, req.body.lng, req.body.type, req.body.coat, 
    req.body.color, req.body.breed, function(err){
        if(err){
            //dodanie ogloszenia sie nie powiodlo - kasujemy powiazane z nim zdjecia
            req.files.forEach((e) => {
                fs.unlink('./pictures/' + e.filename, (err) => {
                    if(err){
                        log.error('unlink: ', err);
                    } 
                });
            });
            log.debug(err);
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
    con.get(`SELECT 
                * 
            FROM 
                anons 
            WHERE 
                id = ?`, req.query.id, (err, row) => {
        if(err){
            log.debug(err);
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
            breed: (row.breed == null ? undefined : row.breed),
            is_active: row.is_active
        });
    });
});


// zwraca liste ogloszen sortowana po dacie utworzenia malejaco i liczbe przeslanych ogloszen
// parametry: page, num, category, title, type, coat, color, breed, lat, lng, rad
// parametr page informuje, ktora strone ogloszen zwrocic
// parametr num informuje, ile ogloszen ma przypadac na strone
// jesli parametr num jest niezdefiniowany, przyjmuje wartosc 30
// jesli parametr page jest niezdefiniowany, to zwracane sa wszystkie ogloszenia
// category, title, type, coat, color, breed pozwalaja filtrowac ogloszenia
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
    if(req.query.title){
        filters.push('title LIKE ?');
        parameters.push('%' + req.query.title + '%');
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

    let statement = `SELECT 
                        id, 
                        title, 
                        category, 
                        images image, 
                        datetime(create_date, "unixepoch", "localtime") create_date, 
                        lat, 
                        lng, 
                        type 
                    FROM 
                        anons` + 
                        (filters.length > 0 ? ' WHERE ' : '') + 
                        filters.join(' AND ') + ' ORDER BY create_date DESC;'

    // dane odsylane do klienta
    let arr = [];
    con.each(statement, parameters, (err, row) => {
        if(err){
            log.debug(err);
            res.sendStatus(500);
        }
        // zdefiniowano parametry lat i lng - obliczamy odleglosc od zadanego punktu w pelnych kilometrach
        if(!isNaN(parseFloat(req.query.lat)) && !isNaN(parseFloat(req.query.lng))){
            row.distance = parseInt(distance({lat: req.query.lat, lng: req.query.lng}, {lat: row.lat, lng: row.lng}) / 1000);
            //odfiltrowujemy zbyt oddalone ogloszenia
            if(row.distance < ((isNaN(parseInt(req.query.rad))) ? 30000 : req.query.rad * 1000)){
                arr.push(row);
            }
        }
        else{
            arr.push(row);
        }
    }, (err, number) => {
        if(err){
            log.debug(err);
            res.sendStatus(500);
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
    log.trace('/ : put\nfiles:', req.files, '\nbody:', req.body);
    //brakuje ktoregos z niezbednych pol lub ktores z pol zawiera niepoprawne dane - ogloszenie nie moze zostac zaktualizowane
    if(!(req.body.id && req.body.title && req.body.description && req.body.category && req.body.lat && req.body.lng && req.body.type) || 
    (req.body.category != 0 && req.body.category != 1) || isNaN(parseFloat(req.body.lat)) || isNaN(parseFloat(req.body.lng))){
        req.files.forEach((e) => {
            fs.unlink('./pictures/' + e.filename, (err) => {
                if(err){
                    log.error('unlink: ', err);
                } 
            });
        });
        return res.status(400).json({msg: 'required field is empty/contain invalid data'});
    }
    con.get(`SELECT 
                author_id, 
                images 
            FROM 
                anons 
            WHERE 
                id = ?;`, req.body.id, (err, row) => {
        if(err){
            log.debug(err);
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
        con.run(`UPDATE 
                    anons 
                SET 
                    title = ?, 
                    description = ?, 
                    category = ?, 
                    images = ?, 
                    lat = ?, 
                    lng = ?, 
                    type = ?, 
                    coat = ?, 
                    color = ?, 
                    breed = ? 
                WHERE 
                    id = ?;`, 
        req.body.title, req.body.description, req.body.category, pictures, req.body.lat, req.body.lng, req.body.type, req.body.coat, req.body.color, req.body.breed, req.body.id, 
        function(err){
            if(err){
                //aktualizacja ogloszenia sie nie powiodlo - kasujemy powiazane z nim zdjecia
                req.files.filename.forEach((e) => {
                    fs.unlink('./pictures/' + e.filename, (err) => {
                        if(err){
                            log.error('unlink: ', err);
                        } 
                    });
                });
                log.debug(err);
                return res.sendStatus(500);
            }
            //usuwamy stare zdjecia
            if(row.images.length > 0){
                row.images.split('#').forEach((e) => {
                    fs.unlink('./pictures/' + e, (err) => {
                        if(err){
                            log.error('unlink: ', err);
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
    con.get(`SELECT 
                images, 
                author_id 
            FROM 
                anons 
            WHERE 
                id = ?;`, req.body.id, (err, row) => {
        if(err){
            log.debug(err);
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
        con.run(`DELETE FROM 
                    anons 
                WHERE 
                    id = ?`, req.body.id, (err) => {
            if(err){
                log.debug(err);
                return res.sendStatus(500);
            }
            return res.sendStatus(200);
        }); 
        //jesli ogłoszenie mialo jakies zdjecia - usun je
        if(row.images.length > 0){
            row.images.split('#').forEach((e) => {
                fs.unlink('./pictures/' + e, (err) => {
                    if(err){
                        log.error('unlink: ', err);
                    } 
                });
            });
        }  
    });
});


// zwraca liste ogloszen utworzonych przez uzytkownika sortowana po dacie utworzenia malejaco 
// wraz z iloscia nieodczytanych notyfikacji dla kazdego z ogloszen i liczbe przeslanych ogloszen
router.get('/my', (req, res) => {
    con.all(`SELECT 
                id, 
                category, 
                title, 
                datetime(create_date, "unixepoch", "localtime") create_date, 
                images image, 
                type, 
                is_active,
                (SELECT 
                    COUNT(*) 
                FROM 
                    notifications 
                WHERE 
                    anons.id = notifications.anon_id AND notifications.is_new = 1)
                AS
                    notifications_count 
            FROM 
                anons 
            WHERE 
                author_id = ?`, 
    req.session.user_id, (err, rows) => {
        if(err){
            log.debug(err);
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


// zwraca listę notyfikacji zalogowanego klienta - wymagane zalogowanie
// parametry: id : integer - id ogloszenia, ktorego dotyczyc maja notyfikacje (nieobowiazkowy)
router.get('/notifications', (req, res) => {
    if(req.query.id){
        con.get(`SELECT 
                    author_id 
                FROM 
                    anons 
                WHERE 
                    id = ?;`, req.query.id, (err, row) => {
            if(err){
                log.debug(err);
                return res.sendStatus(500);
            }
            //brak ogloszenia o podanym id
            if(!row){
                return res.sendStatus(404);
            }
            //klient nie jest autorem ogloszenia
            if(row.author_id != req.session.user_id){
                return res.sendStatus(403);
            }
            con.all(`SELECT 
                        id, 
                        anon_id, 
                        image, 
                        lat, 
                        lng, 
                        datetime(create_date, "unixepoch", "localtime") create_date 
                    FROM 
                        notifications 
                    WHERE 
                        anon_id = ?;`, 
            req.query.id, (err, rows) => {
                if(err){
                    log.debug(err);
                    return res.sendStatus(500);
                }
                if(rows.length > 0){
                    //oznaczenie wyslanych notyfikacji jako odczytanych
                    let query = 'UPDATE notifications SET is_new = 0 WHERE id IN(' + Array(rows.length).fill('?').join(', ') + ')';
                    let params = [];
                    rows.forEach((e, i) => {
                        params.push(e.id);
                        rows[i].id = undefined;
                    });
                    con.run(query, params, (err) => {});
                }
                return res.status(200).json(rows);
            });
        });
    }
    // nie podano id
    else{
        con.all(`SELECT 
                    id, 
                    anon_id, 
                    image, 
                    lat, 
                    lng, 
                    datetime(create_date, "unixepoch", "localtime") create_date 
                FROM 
                    notifications 
                WHERE 
                    anon_id IN (
                        SELECT 
                            id 
                        FROM 
                            anons 
                        WHERE 
                            author_id = ?)`, req.session.user_id, (err, rows) => {
            if(err){
                log.debug(err);
                return res.sendStatus(500);
            }
            if(rows.length > 0){
                let query = 'UPDATE notifications SET is_new = 0 WHERE id IN(' + Array(rows.length).fill('?').join(', ') + ')';
                let params = [];
                rows.forEach((e, i) => {
                    params.push(e.id);
                    rows[i].id = undefined;
                });
                con.run(query, params, (err) => {});
            }
            return res.status(200).json(rows);
        });
    }
});


// zwraca liczbe nieodczytanych notyfikacji odnosnie ogloszen zalogowanego klienta (wymagane zalogowanie)
router.get('/notifications/count', (req, res) => {
    con.get(`SELECT 
                COUNT(*) count 
            FROM 
                notifications 
            WHERE 
                is_new = 1 AND anon_id IN (
                    SELECT 
                        id 
                    FROM 
                        anons 
                    WHERE 
                        author_id = ?);`, req.session.user_id, (err, row) => {
        if(err){
            log.debug(err);
            return res.sendStatus(500);
        }
        return res.status(200).json({count: row.count});
    });
});


// dodaje notyfikacje do ogloszenia
// req = {anon_id : integer, lng : float, lat : float, picture : file}
// anon_id - id ogloszenia, ktorego dotyczy notyfikacja
// lng - dlugosc geograficzna w stopniach
// lat - szerokosc geograficzna w stopniach
// picture - zdjecie
router.post('/notifications', singleUpload.single('picture'), (req, res) => {
    // brakuje ktoregos z niezbednych pol lub ktores z pol zawiera niepoprawne dane - notyfikacja nie moze zostac dodana
    if(!req.body.anon_id || isNaN(parseFloat(req.body.lat)) || isNaN(parseFloat(req.body.lng))){
        // usuwanie przeslanych zdjec, jesli istnieja
        if(req.file){
            fs.unlink('./pictures/' + req.file.filename, (err) => {
                if(err){
                    log.error('unlink: ', err);
                } 
            });
        }       
        return res.status(400).json({msg: 'required field is empty/contain invalid data'});
    }

    // dodanie notyfikacji
    con.run(`INSERT INTO notifications(
                anon_id, 
                image, 
                lat, 
                lng, 
                is_new, 
                create_date) 
            VALUES(?, ?, ?, ?, 1, (SELECT strftime ("%s", "now")));`, 
    req.body.anon_id, (req.file ? req.file.filename : ''), req.body.lat, req.body.lng, (err) => {
        if(err){
            // dodanie notyfikacji sie nie udalo - usuwanie przeslanych zdjec
            if(req.file){
                fs.unlink('./pictures/' + req.file.filename, (err) => {
                    if(err){
                        log.error('unlink: ', err);
                    } 
                });
            }
            log.debug(err);
            return res.sendStatus(500);
        }
        return res.sendStatus(200);
    });
});


// aktywuje nieaktywne ogloszenie (wymagane zalogowanie)
// req = {id : integer}
// id - id aktywowanego ogloszenia
router.post('/activate', (req, res) => {
    // nie podano id ogloszenia
    if(!req.body.id){
        return res.sendStatus(400);
    }

    // wyszukaj ogloszenie w bazie danych
    con.get(`SELECT 
                author_id, 
                is_active 
            FROM 
                anons 
            WHERE 
                id = ?;`, req.body.id, (err, row) => {
        if(err){
            log.debug(err);
            return res.sendStatus(500);
        }

        // nie znaleziono ogloszenia o podanym id
        if(!row){
            return res.sendStatus(404);
        }

        // klient nie jest autorem ogloszenia
        if(row.author_id != req.session.user_id){
            return res.sendStatus(403);
        }

        // ogłoszenie już jest aktywne
        if(row.is_active != 0){
            return res.sendStatus(200);
        }

        // aktywuj ogloszenie
        con.run(`UPDATE 
                    anons 
                SET 
                    is_active = 1, 
                    create_date = (SELECT strftime ("%s", "now")) 
                WHERE 
                    id = ?;`, req.body.id, (err) => {
            if(err){
                log.debug(err);
                return res.sendStatus(500);
            }
        });
        return res.sendStatus(200);
    });
});


module.exports = router;
