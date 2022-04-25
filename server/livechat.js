
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

var lastMessage, lastImage, lastChat;

con.get(`SELECT (SELECT MAX(message_id) from ChatMessages) msgId,
                (SELECT MAX(image_id) from ChatImages) imgId,
                (SELECT MAX(chat_id) from ChatUsers) chatId`,
    (err, result) => {
        if (!err) {
            lastMessage = result.msgId ?? 0;
            lastImage = result.imgId ?? 0;
            lastChat = result.chatId ?? 0;

            console.log('msg id:', lastMessage,', img id:', lastImage,', chat_id:', lastChat)
        } else { 
            console.debug(err);
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
    console.log("client connected", socket.id, '[', socket.handshake.address, ']');

    socket.on('disconnecting', () => {
        socket.rooms.forEach((chatroom, roomidx, rooms) => {
            // powiadomienia o wyjściu dla członków chatroom'u
            socket.to(chatroom).emit('user-leave', chatroom, socket.userName); 
            socket.leave(chatroom);

            // Aktualizacja daty ostaniej wizyty w chatroomie
            con.run('UPDATE ChatUsers SET last_seen_time = ? WHERE chat_id = ? and user_id = ?',
                Date.now(), chatroom, socket.userId);
        });
    });

    socket.on("disconnect", () => {
        console.log('client disconnected', socket.id, '[', socket.handshake.address, ']');

        // zapisywać datę i godzinę rozłączenia użytkownika
        // żeby przy zalogowaniu móc podawać informację 
        // o nowych wiadomościach na czatach

        con.run('UPDATE users SET last_active_time = ? WHERE id = ?', Date.now(), socket.userId);
        //socketUserMap.delete(socket.id);
        userSocketMap.delete(socket.userId);

    });

    // middleware do weryfikacji autoryzacji
    socket.use(([event, ...args], next) => {

        if ('auth-request' !== event) {
            console.log(socket.userName, ': ', event);
            if (!socket.userId) {
                return next(new Error('unauthorized'));
            }
        } else {
            console.log(socket.id, ': ', event, args[0]);
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
        `WITH Chats (anons_id, chat_id, convers_id, asking_id) AS (
            SELECT ow.anons_id, ow.chat_id, co.user_id, ow.user_id FROM ChatUsers ow
                JOIN ChatUsers co ON ow.chat_id = co.chat_id AND ow.user_id <> co.user_id 
                WHERE ow.user_id = ?)
            SELECT c.anons_id, c.chat_id, users.login, anons.title, 
                (SELECT count(*) FROM ChatMessages chm 
                    WHERE chm.chat_id = c.chat_id
                ) AllMsgs,
                (SELECT count(*) FROM ChatMessages chm 
                    WHERE chm.chat_id = c.chat_id
                        AND chm.user_id <> c.convers_id AND chm.message_date > 
                            (SELECT last_active_time FROM users u WHERE u.id = c.convers_id)
                ) NewMsgs			
            FROM Chats c
            JOIN anons on c.anons_id = anons.id
            JOIN users on c.convers_id = users.id`, socket.userId,
            (err, result) => {
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
    //  - chatId   : id chatu

    socket.on('get-chat-messages', (chatId) => {
        // wysyłamy do użytkownika wiadomości z konkretnego chatu
        con.all(`WITH Chats (anons_id, chat_id, user_id) as (
            SELECT anons_id, chat_id, user_id
            FROM ChatUsers WHERE user_id = ?)
            SELECT cm.message_id, ch.anons_id, cm.chat_id, users.login, cm.message_date,
                cm.message_text, ci.message_id
            FROM ChatMessages cm JOIN users ON cm.user_id = users.id
                JOIN Chats ch ON ch.chat_id = cm.chat_id
                LEFT JOIN ChatImages ci ON ci.message_id = cm.message_id
            WHERE cm.chat_id = ?
            ORDER BY cm.message_date ASC`, socket.userId, chatId,
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
        con.get(`SELECT chat_id, count(*) cnt FROM ChatUsers WHERE anons_id = $anons and user_id = $user`,
                { $anons: anonsId, $user: socket.userId },
            (err, result) => {

            if (!err) {
                if (result.cnt > 0) {
                    // chat jest już utworzony w bazie - nie można dodać nowego!
                    socket.emit('new-chat-response', result.chat_id, 'Chat already exists');
                } else {
                    // czy istanieje anons, do którego będzie utworzowny chat?
                    con.get(`SELECT
                            (SELECT COUNT(*) FROM anons WHERE author_id = ? AND id = ?) [selfchat],
                            (SELECT COUNT(*) cnt FROM anons WHERE id = ?) [exists]`,
                            socket.userId, anonsId, anonsId,
                        (err, result) => {
                            if (!err) {
                                if (result.selfchat !== 0 || result.exists === 0) {
                                    socket.emit('new-chat-response', -1, 'Cannot create chat');
                                }
                                else {
                                    // można dodać nowy chat, lastChat => chatroom
                                    ++lastChat;             
                                    socket.join(lastChat);
                                
                                    con.run(`INSERT INTO ChatUsers (anons_id, chat_id, user_id)
                                             VALUES (?, ?, ?)`, anonsId, lastChat, socket.userId);
                                    con.run(`INSERT INTO ChatUsers (anons_id, chat_id, user_id)
                                             SELECT id, ?, author_id FROM anons WHERE id = ?`, lastChat, anonsId,
                                            (err) => {
                                                if (err) { console.debug(err); }
                                            });

                                    socket.emit('new-chat-response', lastChat, 'Chat created');
                                }
                            } else { console.debug(err); }
                        });
                }
            } else { console.debug(err); }
        });
    });

    ///////////////////////////////////////////////////////////
    // dołącza użytkownika do założonego wcześniej czatu
    // parametry:
    //  - chatId    : chat_id z tabeli [UserChats],
    //      zwracane po zapytanie [get-user-chats] 
    //      oraz przy zakładaniu nowego chat-u
    
    socket.on("join-chat", (chatId) => {
        const chatroom = typeof chatId === 'number' ? chatId : parseInt(chatId);

        // czy user_id ma założony chat
        con.get('SELECT COUNT(*) cnt FROM ChatUsers WHERE chat_id = ? AND user_id = ?', chatroom, socket.userId,
            (err, result) => {
                if (!err) {
                    if (result.cnt > 0) {
                        socket.join(chatroom);
                        socket.to(chatroom).emit('user-join', chatroom, socket.userName);
                        socket.emit('join-chat-response', chatroom, 'Joined to chatroom');
                    }
                    else {
                        socket.emit('join-chat-response', -1, 'Not in chatroom');
                    }
                }
            });
    });


    ///////////////////////////////////////////////////////////
    // odłącza użytkownika od pokoju czatowego
    // parametry:
    //  - chatId    : chat_id z tabeli [UserChats],
    //      zwracane po zapytanie [get-user-chats] 
    //      oraz przy zakładaniu nowego chat-u

    socket.on("leave-chat", (chatId) => {
        const chatroom = typeof chatId === 'number' ? chatId : parseInt(chatId);

        if (socket.rooms.has(chatroom)) {
            socket.to(chatroom).emit('user-leave', chatroom, socket.userName); 
            socket.leave(chatroom);

            socket.emit('leave-chat-response', chatroom, 'You have left the chatroom');

            // Aktualizacja daty ostaniej wizyty w chatroomie
            con.run('UPDATE ChatUsers SET last_seen_time = ? WHERE chat_id = ? and user_id = ?',
                Date.now(), chatroom, socket.userId, (err) => {
                    if (err) {console.debug(err)}
                }
            );
        } else {
            socket.emit('leave-chat-response', -1, 'Not in chatroom');
        }
    });


    ///////////////////////////////////////////////////////////
    // odbiera od klienta i rozsyła do pozostałych członków czatu
    // wiadomość tekstową oraz zapisuję ją w bazie danych
    // parametry:
    //  - chatId    : chat_id z tabeli [UserChats],
    //      zwracane po zapytanie [get-user-chats] 
    //      oraz przy zakładaniu nowego chat-u
    // - msgText    : treść wiadomości tekstowej

    socket.on("chat-msg", (chatId, msgText) => {
        const chatroom = typeof chatId === 'number' ? chatId : parseInt(chatId);

        // wiadomość do użytkowników podłączonych do pokoju 
        if (!socket.rooms.has(chatroom)) {
            socket.emit('chat-response', -1, "Not in chatroom");
            return;
        }
        
        let curDate = Date.now();
        ++lastMessage;

        io.to(chatroom).emit('chat-msg', lastMessage, chatroom, socket.userName, curDate, msgText); 

        con.run(`INSERT INTO ChatMessages (message_id, chat_id, user_id, message_date, message_text)
                 VALUES (${lastMessage}, ${chatroom}, ${socket.userId}, ${curDate}, "${msgText}")`,
            (err) => {
                if (err) { console.debug(err); }
            });

        // dodatkowo powinniśmy powiadomić wszystkich użytkowników (u nas jednego), których to dotyczy,
        // tj. podłączonych do serwera/aplikacji ale nie będących aktualnie w pokoju czatowym,
        // że na czasie pojawiła się nowa wiadomość

        // tabelę ChatUsers można wczytać do pamięci operacyjnej przy uruchamianiu serwera
        // żeby nie robić zapytań SQL przy każdej wiadomośc chat-owej

        con.each('SELECT user_id FROM ChatUsers WHERE chat_id = ? AND user_id <> ?', chatroom, socket.userId,
            (err, user) => {
                if (!err) {
                    let sockid = userSocketMap.get(user.user_id);
                    if (sockid) {
                        // znajdź socket po socket.id i sprawdź czy jest w pokoju,
                        // jeśli nie to wyślij mu powiadomienie o nowej wiadomości 
                        // w pokoju czatowym
                        let sock = io.sockets.sockets.get(sockid)
                        if (!sock.rooms.has(chatroom)) {
                            io.to(sockid).emit('new-msg-notification', lastMessage, chatroom, socket.userName, curDate, msgText);
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
    //  - chatId    : chat_id z tabeli [UserChats],
    //      zwracane po zapytanie [get-user-chats] 
    //      oraz przy zakładaniu nowego chat-u
    //  - imgName   : nazwa pliku obrazu
    //  - imgType   : type MIME trreści pliku
    //  - imgData   : zawartość binarna pliku (pobrana z ArrayBuffer/Buffer)
    
    socket.on("chat-img", (chatId, imgName, imgType, imgData) => {
        const chatroom = typeof chatId === 'number' ? chatId : parseInt(chatId);

        if (!socket.rooms.has(chatroom)) {
            socket.emit('chat-response', -1, "Not in chatrom");
            return;
        }

        const curDate = Date.now();
        ++lastImage;
        ++lastMessage;

        io.to(chatroom).emit('chat-img', lastMessage, chatroom, socket.userName, curDate, lastImage, imgName, imgType);

        const imgFileName = chatroom + '-' + lastImage + '!' + imgName;
        const imgFilePath = path.resolve(__dirname, 'chatpictures', imgFileName);

        try {
            const writer = fs.createWriteStream(imgFilePath);
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

        con.run(`INSERT INTO ChatMessages (message_id, chat_id, user_id, message_date) VALUES
                 (${lastMessage}, ${chatroom}, ${socket.userId}, ${curDate})`, (err) => {
                    if (err) { console.debug(err); }
                 });
        con.run(`INSERT INTO ChatImages (image_id, message_id, user_id, filename, filepath, mimetype) VALUES
                 (${lastImage}, ${lastMessage}, ${socket.userId}, "${imgFileName}", "${imgFilePath}", "${imgType}");`,
            (err) => {
                if (err) { console.debug(err); }
            });
        
        con.each('SELECT user_id FROM ChatUsers WHERE chat_id = ? AND user_id <> ?',
            chatroom, socket.userId, (err, user) => {
            if (!err) {
                const sockid = userSocketMap.get(user.user_id);
                if (sockid) {
                    // znajdź socket po socket.id i sprawdź czy jest w pokoju,
                    // jeśli nie to wyślij mu powiadomienie o nowej wiadomości 
                    // w pokoju czatowym
                    const sock = io.sockets.sockets.get(sockid)
                    if (!sock.rooms.has(chatroom)) {
                        io.to(sockid).emit('new-img-notification', lastMessage, chatroom, socket.userName, curDate, lastImage, imgName, imgType);
                    }
                }
            }
        });
    });

    socket.on('get-image', (imageId) => {
        con.get('SELECT filepath, mimetype FROM ChatImages WHERE image_id = ?', imageId,
            (err, result) => {
                if (!err) {
                    if (result) {
                        fs.readFile(result.filepath, (err, filedata) => {
                            if (!err) {
                                socket.emit('image', imageId, result.filename, result.mimetype, filedata);
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