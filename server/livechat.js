require('dotenv').config();

const express = require('express');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer, {});
const fs = require('fs');


const con = require('./dbCon.js');
const { SocketAddress } = require('net');

let lastMessage, lastImage;

con.get('SELECT MAX(message_id) msgID from ChatMessages', (err, result) => {
    if (err) {
        console.log(err.name + " | " + err.message);
        throw err;
    } else {
        lastMessage = result.msgID ?? 0;
    }
});
con.get('SELECT MAX(image_id) imgID from Images', (err, result) => {
    if (err) {
        console.log(err.name + " | " + err.message);
        throw err;
    } else { 
        lastImage = result.imgID ?? 0;
    }
});


// mapa przechowujące aktualne wiązanie użytkownika
// z jego połączeniem (socket.id)
var socketUserMap = new Map();
var userSocketMap = new Map();


io.on("connection", function (socket) {
    let self = this;
    console.log("client connected");

    socket.on("disconnect", () => {
        console.log('client disconnected');
        
        // zapisywać datę i godzinę rozłączenia użytkownika
        // żeby przy zalogowaniu móc podawać informację 
        // o nowych wiadomościach na czatach

        let user = socketUserMap.get(socket.id);

        con.run('UPDATE Users SET last_active_time = ? WHERE userid = ?', Date.now(), user);
        socketUserMap.delete(socket.id);
        userSocketMap.delete(user);

    });


    // zwrócić listę chat-ów z informacją ile jest wiadomości oraz ile nowych wiadomości

    socket.on('get-user-chats', (userid) => {
        con.all(
        `WITH Chats (anons_id, chat_id) AS (SELECT anons_id, chat_id FROM UserChats WHERE user_id = ?)
            SELECT cm.anons_id, cm.chat_id, count(*) All,
                (SELECT count(*) FROM ChatMessages 
                    WHERE anons_id = cm.anons_id AND chat_id = cm.chat_id
                        AND message_date > users.last_active_time) New
            FROM ChatMessages cm 
                JOIN Chats uc ON cm.anons_id = uc.anons_id AND cm.chat_id = uc.chat_id
                JOIN users ON cm.user_id = users.id
            WHERE cm.user_id <> ? 
            GROUP BY cm.anons_id, cm.chat_id`
        , userid, userid, (err, result) => {
            if (err) {
                socket.emit('error', err);
            } else {
                socket.emit('user-chats', result);
            }                                
        });
    });

    socket.on('get-chat-messages', (anonsid, userid) => {
        // wysyłamy do użytkownika wiadomości z konkretnego chatu

        con.all('SELECT messageid, anonsid, userid, message_date, message_text FROM ChatMessages WHERE anonsid = ? AND userid = ?',
            anonsid, userid, (err, result) => {
                if (err) {
                    socket.emit('error', err);
                } else {
                    socket.emit('chat-messages', result);
                }                        
            });
    });


    socket.on('auth-req', ({userid}) => {
            // tutaj uwierzytelniamy(?) użytkownika 
            // i wysyłamu mu status, czyli informacje o jego 
            // czatach i wiadomościach na nich

            // dopisujemy użytkownika do mapy (socketid, userid)
            socketUserMap.set(socket.id, userid);
            userSocketMap.set(userid, socket.id);
            self.userId = userid;

            // zapytanie do bazy wyciągające wiadomości na czatach
            // do uzytkownika i je odsyłamy

            //con.all('select message from charMessage where userid = ?', userid); // ZMIENIĆ!!!

            socket.emit('auth-res', {status: 1});
            
    });

    socket.on('new-chat', ({anonsid, chatid}) => {
        let chatroom = anonsid + ':' + chatid;
        socket.join(chatroom);

        con.run(`INSERT INTO ChatUsers (anons_id, chat_id, user_id) VALUES (?, ?, ?)`, anonsid, chatid, chatid);
        con.run(`INSERT INTO ChatUsers (anons_id, chat_id, user_id)
                SELECT id, ?, author_id FROM anons
                WHERE id = ?`, chatid, anonsid, (err) => {
                    console.log(err.name + " | " + err.message);
                    throw err;                    
                });

        // powiadomienie dla ew. zalogowane drugiego użytkownika,
        // że pojawił się inny rozmówca
        // io.to(chatroom).broadcast('user-enter', {anons: anonsid, chat: chatid, user: chatid });
    });

    socket.on("join-chat", ({anonsid, chatid, userid}) => {
        let chatroom = anonsid + ':' + chatid;
        socket.join(chatroom);
        io.to(chatroom).broadcast('user-join', {anons: anonsid, chat: chatid, user: userid });

        //userSocketMap.get(userid).emit('new-message', {anons: anonsid, chat: chatid, user: userid});
    });

    socket.on("leave-chat", ({anonsid, chatid, userid}) => {
        let chatroom = anonsid + ':' + chatid;
        socket.leave(chatroom);
        io.to(chatroom).broadcast('user-leave', {anons: anonsid, chat: chatid, user: userid });
    });

    socket.on("message", ({anonsid, chatid, userid, text}) => {
        let curDate = Date.now();
        lastMessage++;
        con.run(`INSERT INTO ChatMessages (message_id, anons_id, user_id, message_date, message_text) VALUES
                 (${lastMessage}, ${anonsid}, ${userid}, ${curDate}, "${text}")`);


        // wiadomość do użytkowników podłączonych do pokoju 
        let chatroom = anonsid + ':' + chatid;
        io.to(chatroom).brodcast.emit('message', {anonsid, userid, text});  // zmienić grupę na właściwą dla użytkownika i anonsu

        // dodatkowo powinniśmy powiadomić wszystkich użytkowników (u nas jednego), których to dotyczy,
        // tj. podłączonych do serwera/aplikacji ale nie będących aktualnie w pokoju czatowym,
        // że na czasie pojawiła się nowa wiadomość
        con.run('SELECT user_id FROM ChatUsers WHERE anons_id = ? AND chat_id = ?', anonsid, chatid, (err, result) => {
            for (let user in result) {
                let sockid = userSocketMap.get(user.user_id);
                if (sockid != undefined ) {
                    // znajdź socket po socket.id i sprawdź czy jest w pokoju,
                    // jeśli nie to wyślij mu powiadomienie o nowej wiadomości 
                    // w pokoju czatowym

                }
            }
        });
        
    });


    socket.on("message_image", ({anonsid, userid, image}) => {

        socket.broadcast.emit('message_image', {anonsid, userid, image}); // zmienić grupę na właściwą dla użytkownika i anonsu

        let curDate = Date.now();
        lastImage++;
        lastMessage++;
        let imgPath = './chatPictures/' + anonsid + '-' + lastImage;

        let writer = fs.createWriteStream(path.resolve(__dirname, imgPath));      
        writer.write(image);
        writer.end();
        writer.on('finish', () => {
            // zapis do pliku na dysku zokończony
        })

        con.run(`INSERT INTO ChatMessages (message_id, anons_id, user_id, message_date, message_text) VALUES
                 (${lastMessage}, ${anonsid}, ${userid}, ${curDate}, NULL)`);
        con.run(`INSERT INTO  Images (image_id, message_id, user_id, path) VALUES
                 (${lastImage}, ${lastMessage}, ${userid}, "${imgPath}")`);
    })

});


module.exports = httpServer;


// przesyłanie obrazów od klienta
/*
reader = new FileReader()
reader.addEventListener('loadend', function () {
    socket.emit('image', {
        name: file.name,
        image: reader.result
    })
})

reader.readAsArrayBuffer(firstFile)
*/
