
// chatid - id uzytkownika zakladajacego czat
//userid - id uzytkownika posiadajacego anons

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);

const con = require('./dbCon.js');
const { resourceUsage } = require('process');

var lastMessage, lastImage;

con.get('SELECT MAX(message_id) msgID from ChatMessages', (err, result) => {
    if (err) {
        console.log(err.name + " | " + err.message);
        throw err;
    } else {
        lastMessage = result.msgID ?? 0;
    }
});
con.get('SELECT MAX(image_id) imgID from ChatImages', (err, result) => {
    if (err) {
        console.log(err.name + " | " + err.message);
        throw err;
    } else { 
        lastImage = result.imgID ?? 0;
    }
});


// mapa przechowujące aktualne wiązanie użytkownika
// z jego połączeniem (socket.id)
//var socketUserMap = new Map();
var userSocketMap = new Map();

const io = new Server(httpServer, {
    cors: {
        origin: process.env.WEB_APP_ROOT_URI,
        credentials: true
      }
});


io.on("connection", function (socket) {
    console.log("client connected", socket.handshake.address);

    socket.on('disconnecting', () => {
        socket.rooms.forEach(chatroom => {
            const [ anonsId, chatId ] = chatroom.split(':', 2);
            // powiadomienia o wyjściu dla członków chatroom'u            
            socket.to(chatroom).emit('user-leave', anonsId, chatId, socket.userName); 
            socket.leave(chatroom);

            // Aktualizacja daty ostaniej wizyty w chatroomie
            con.run('UPDATE ChatUsers SET last_seen_time = ? WHERE anons_id = ? AND chat_id = ? and user_id = ?',
                Date.now(), anonsId, chatId, socket.userId);
        });
    });

    socket.on("disconnect", () => {
        console.log('client disconnected', socket.handshake.address);

        // zapisywać datę i godzinę rozłączenia użytkownika
        // żeby przy zalogowaniu móc podawać informację 
        // o nowych wiadomościach na czatach

        con.run('UPDATE users SET last_active_time = ? WHERE id = ?', Date.now(), socket.userId);
        //socketUserMap.delete(socket.id);
        userSocketMap.delete(socket.userId);

    });

    // middleware do weryfikacji autoryzacji
    socket.use(([event, ...args], next) => {
         console.log(socket.userName, 'event: ', event);
         //console.debug(args);

        if ('auth-request' !== event && !socket.userId) {
            return next(new Error('unauthorized'));
        }
        next();
    });

    // event wysyłany m.in. przez powyższe middleware w przypadku błędu
    socket.on('error', (err) => {
        if (err && err.message === 'unauthorized') {
            socket.emit('auth-response', -1, 'Unauthorized');
        }
    })


    ///////////////////////////////////////////////////////////
    // sprawdza istnieje podanego użytkownika i przypisuje
    // obiektowi [socket] jest identyfikator i nazwę
    socket.on('auth-request', (username) => {
        // tutaj uwierzytelniamy(?) użytkownika 
        con.get('SELECT id FROM users WHERE login = ?', username, (err, result) =>
        {
            if (!err) {
                if (result?.id) {
                    // dopisujemy użytkownika do mapy (socketid, userid)
                    //socketUserMap.set(socket.id, result.id);
                    socket.userId = result.id;
                    socket.userName = username;

                    socket.emit('auth-response', 1, result.id);
                    userSocketMap.set(result.id, socket.id);
                }
                else {
                    socket.emit('auth-response', -1, 'No such user');
                }
            }
        });
    });

    ///////////////////////////////////////////////////////////    
    // zwraca listę czatów z informacją ile jest wszystkich i nowych wiadomości
    socket.on('get-user-chats', () => {
        con.all(
        `WITH Chats (anons_id, chat_id, user_id) AS (
            SELECT anons_id, chat_id, user_id FROM ChatUsers WHERE user_id = ?
            )
            SELECT c.anons_id, c.chat_id,
                (SELECT count(*) FROM ChatMessages cm
                    WHERE cm.anons_id = c.anons_id AND cm.chat_id = c.chat_id
                ) AllMsgs,
                (SELECT count(*) FROM ChatMessages cm 
                    WHERE cm.anons_id = c.anons_id AND cm.chat_id = c.chat_id
                        AND cm.user_id <> c.user_id AND cm.message_date > 
                            (SELECT last_active_time FROM users WHERE id = c.user_id)
                ) NewMsgs			
            FROM Chats c`
        , socket.userId, (err, result) => {
            if (!err) {
                socket.emit('user-chats', result.length, result);
            } else {
                console.debug(err);
            }                                
        });
    });


    ///////////////////////////////////////////////////////////
    // zwraca listę wiadomości z podanego czatu
    // parametry:
    //  - anonsId   : id anonsu z tabeli [anons]

    socket.on('get-chat-messages', (anonsId, chatId) => {
        // wysyłamy do użytkownika wiadomości z konkretnego chatu
        con.all(`SELECT message_id, anons_id, chat_id, user_id, message_date, message_text
                 FROM ChatMessages WHERE anons_id = ? AND chat_id = ?`, anonsId, chatId,
                (err, result) => {
                    if (!err) {
                        socket.emit('chat-messages', result.length, result);
                    } else {
                        console.debug(err);
                    }
        });
    });

    ///////////////////////////////////////////////////////////
    // zakład anowy czat do istniejącego anonsu
    // parametry:
    //  - anonsId   : id anonsu z tabeli [anons]

    socket.on('new-chat', (anonsId) => {

        // czy istnieje już czat, który ma być założony?
        con.get(`SELECT COUNT(*) cnt FROM (
                SELECT anons_id FROM ChatUsers WHERE anons_id = $anons AND chat_id = $user
                UNION ALL
                SELECT id FROM anons WHERE id = $anons AND author_id = $user
                )`, { $anons: anonsId, $user: socket.userId }, (err, result) => {

            if (!err) {
                if (result.cnt > 0) {
                    // chat jest już utworzony w bazie - nie można dodać nowego!
                    socket.emit('new-chat-response', -1, 'Chat already exists or own advert');
                } else {
                    // czy istanieje anons, do którego będzie utworzowny chat?
                    con.get('SELECT COUNT(*) cnt FROM anons WHERE id = ?', anonsId,
                        (err, result) => {
                            if (!err) {
                                if (result.cnt === 0) {
                                    socket.emit('new-chat-response', -1, 'Advert does not exist');
                                }
                                else {
                                    // można dodać nowy chat
                                    let chatroom = anonsId + ':' + socket.userId;
                                    socket.join(chatroom);
                                
                                    con.run(`INSERT INTO ChatUsers (anons_id, chat_id, user_id) VALUES (?, ?, ?)`,
                                        anonsId, socket.userId, socket.userId);
                                    con.run(`INSERT INTO ChatUsers (anons_id, chat_id, user_id)
                                        SELECT id, ?, author_id FROM anons WHERE id = ?`, socket.userId, anonsId,
                                        (err) => {
                                            if (err) { console.log(err.name + " | " + err.message); }
                                        });

                                    socket.emit('new-chat-response', socket.userId, 'Chat created');
                                }
                            } else { console.log('[new-chat] error: ', err.message); }
                        });
                }
            } else { console.log('[new-chat] error: ', err.message); }
        });
    });

    ///////////////////////////////////////////////////////////
    // dołącza użytkownika do założonego wcześniej czatu
    // parametry:
    //  - anonsId   : id anonsu z tabeli [anons]
    //  - chatId    : chat_id z tabeli [UserChats],
    //      zwracane po zapytanie [get-user-chats] 
    //      oraz przy zakładaniu nowego chat-u
    
    socket.on("join-chat", (anonsId, chatId) => {

        // czy user_id ma założony chat
        con.get('SELECT COUNT(*) cnt FROM ChatUsers WHERE anons_id = ? AND chat_id = ? ', anonsId, chatId, 
        (err, result) => {
            if (!err) {
                if (result.cnt > 0) {
                    let chatroom = anonsId + ':' + chatId;

                    socket.join(chatroom);
                    socket.to(chatroom).emit('user-join', anonsId, chatId, socket.userName);
                    socket.emit('join-chat-response', 1, 'Joined to chatroom');
                }
                else {
                    socket.emit('join-chat-response', -1, 'No such chatroom');
                }
            }
        })
    });


    ///////////////////////////////////////////////////////////
    // odłącza użytkownika od pokoju czatowego
    // parametry:
    //  - anonsId   : id anonsu z tabeli [anons]
    //  - chatId    : chat_id z tabeli [UserChats],
    //      zwracane po zapytanie [get-user-chats] 
    //      oraz przy zakładaniu nowego chat-u

    socket.on("leave-chat", (anonsId, chatId) => {
        let chatroom = anonsId + ':' + chatId;
        if (socket.rooms.has(chatroom)) {
            socket.to(chatroom).emit('user-leave', anonsId, chatId, socket.userName); 
            socket.leave(chatroom);

            socket.emit('leave-chat-response', 1, 'You have left the chatroom');

            // Aktualizacja daty ostaniej wizyty w chatroomie
            con.run('UPDATE ChatUsers SET last_seen_time = ? WHERE anons_id = ? AND chat_id = ? and user_id = ?',
                Date.now(), anonsId, chatId, socket.userId
            );
        } else {
            socket.emit('leave-chat-response', -1, 'Not in chatroom');
        }
    });


    ///////////////////////////////////////////////////////////
    // odbiera od klienta i rozsyła do pozostałych członków czatu
    // wiadomość tekstową oraz zapisuję ją w bazie danych
    // parametry:
    //  - anonsId   : id anonsu z tabeli [anons]
    //  - chatId    : chat_id z tabeli [UserChats],
    //      zwracane po zapytanie [get-user-chats] 
    //      oraz przy zakładaniu nowego chat-u
    // - msgText    : treść wiadomości tekstowej

    socket.on("chat-msg", (anonsId, chatId, msgText) => {

        // wiadomość do użytkowników podłączonych do pokoju 
        let chatroom = anonsId + ':' + chatId;
        if (!socket.rooms.has(chatroom)) {
            socket.emit('chat-response', -1, "Not in chatrom");
            return;
        }
        
        let curDate = Date.now();
        ++lastMessage;

        io.to(chatroom).emit('chat-msg', lastMessage, anonsId, chatId, socket.userName, curDate, msgText); 

        con.run(`INSERT INTO ChatMessages (message_id, anons_id, chat_id, user_id, message_date, message_text) VALUES
                 (${lastMessage}, ${anonsId}, ${chatId}, ${socket.userId}, ${curDate}, "${msgText}")`);

        // dodatkowo powinniśmy powiadomić wszystkich użytkowników (u nas jednego), których to dotyczy,
        // tj. podłączonych do serwera/aplikacji ale nie będących aktualnie w pokoju czatowym,
        // że na czasie pojawiła się nowa wiadomość

        // tabelę ChatUsers można wczytać do pamięci operacyjnej przy uruchamianiu serwera
        // żeby nie robić zapytań SQL przy każdej wiadomośc chat-owej

        con.each('SELECT user_id FROM ChatUsers WHERE anons_id = ? AND chat_id = ? AND user_id <> ?',
            anonsId, chatId, socket.userId, (err, user) => {
                if (!err) {
                    let sockid = userSocketMap.get(user.user_id);
                    if (sockid) {
                        // znajdź socket po socket.id i sprawdź czy jest w pokoju,
                        // jeśli nie to wyślij mu powiadomienie o nowej wiadomości 
                        // w pokoju czatowym
                        let sock = io.sockets.sockets.get(sockid)
                        if (!sock.rooms.has(chatroom)) {
                            io.to(sockid).emit('new-chat-msg', lastMessage, anonsId, chatId, socket.userName, curDate, msgText);
                        }
                    }
                }
            });
    });


    ///////////////////////////////////////////////////////////
    // Odbiera od klienta i rozsyła do pozostałych członków czatu
    // wiadomość w postaci obrazu graficznego oraz zapisuje go
    // na dysku oraz w bazie danych
    // parametry:
    //  - anonsId   : id anonsu z tabeli [anons]
    //  - chatId    : chat_id z tabeli [UserChats],
    //      zwracane po zapytanie [get-user-chats] 
    //      oraz przy zakładaniu nowego chat-u
    //  - imgName   : nazwa pliku obrazu
    //  - imgType   : type MIME trreści pliku
    //  - imgData   : zawartość binarna pliku (pobrana z ArrayBuffer/Buffer)
    
    socket.on("chat-img", (anonsId, chatId, imgName, imgType, imgData) => {

        let chatroom = anonsId + ':' + chatId;
        if (!socket.rooms.has(chatroom)) {
            socket.emit('chat-response', -1, "Not in chatrom");
            return;
        }

        let curDate = Date.now();
        ++lastImage;
        ++lastMessage;

        io.to(chatroom).emit('chat-img', lastImage, anonsId, chatId, socket.userName, curDate, imgName, imgType, imgData);

        let imgFileName = anonsId + '-' + lastImage + '!' + imgName;
        let imgFilePath = path.resolve(__dirname, 'chatpictures', imgFileName);

        try {
            let writer = fs.createWriteStream(imgFilePath);
            writer.write(imgData);
            writer.end();
            writer.on('finish', () => {
                // zapis do pliku na dysku zokończony
                console.log('Image saved to: ', imgFileName)
            });
        }
        catch (error) {
            console.debug(error)
        }

        con.run(`INSERT INTO ChatMessages (message_id, anons_id, chat_id, user_id, message_date) VALUES
                 (${lastMessage}, ${anonsId}, ${chatId},${socket.userId}, ${curDate})`);
        con.run(`INSERT INTO ChatImages (image_id, message_id, user_id, path, type) VALUES
                 (${lastImage}, ${lastMessage}, ${socket.userId}, "${imgFilePath}", "${imgType}")`);
        
        
        con.each('SELECT user_id FROM ChatUsers WHERE anons_id = ? AND chat_id = ? AND user_id <> ?',
            anonsId, chatId, socket.userId, (err, user) => {
                if (!err) {
                    const sockid = userSocketMap.get(user.user_id);
                    if (sockid) {
                        // znajdź socket po socket.id i sprawdź czy jest w pokoju,
                        // jeśli nie to wyślij mu powiadomienie o nowej wiadomości 
                        // w pokoju czatowym
                        const sock = io.sockets.sockets.get(sockid)
                        if (!sock.rooms.has(chatroom)) {
                            io.to(sockid).emit('new-chat-img', lastImage, anonsId, chatId, socket.userName, curDate, imgName, imgType);
                        }
                    }
                }
            });
    });

    socket.on('get-image', (imageId) => {
        con.get('SELECT path, type FROM ChatImages WHERE image_id = ?', imageId, (err, result) => {
            if (!err) {
                if (result) {
                    fs.readFile(result.path, (err, filedata) => {
                        if (!err) {
                            socket.emit('image', imageId, result.path, result.type, filedata);
                        } else {
                            console.debug(err);
                        }
                    });
                }
            } else {
                console.debug(err);
            }
        });
    });
});


module.exports = httpServer;