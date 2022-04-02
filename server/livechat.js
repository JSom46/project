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
const { contentSecurityPolicy } = require('helmet');


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


    // zwrócić listę chat-ów z informacją ile jest wszystkich i nowych wiadomości
    socket.on('get-user-chats', (userid) => {
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
        , userid, (err, result) => {
            if (err) {
                socket.emit('error', err);
            } else {
                socket.emit('user-chats', result);
            }                                
        });
    });

    socket.on('get-chat-messages', (anonsid, userid) => {
        // wysyłamy do użytkownika wiadomości z konkretnego chatu

        con.all('SELECT message_id, anons_id, user_id, message_date, message_text FROM ChatMessages WHERE anons_id = ? AND user_id = ?',
            anonsid, userid, (err, result) => {
                if (err) {
                    socket.emit('error', err);
                } else {
                    socket.emit('chat-messages', result);
                }
        });
    });


    socket.on('auth-request', ({userid}) => {
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

            socket.emit('auth-response', {status: 1});
            
    });

    socket.on('new-chat', (anonsid, chatid) => {
        let chatroom = anonsid + ':' + chatid;
        socket.join(chatroom);

        con.all('SELECT * FROM ChatUsers WHERE anons_id = ? AND chat_id = ?',anonsid, chatid, (err, result) => {
            console.debug(result)

            if (result.length > 0) {
                // chat już jest zapisany w bazie - nie można dodać nowego!

                socket.emit('new-chat', {status: 'EXISTS'});
            } else {
                // można dodać nowy chat

                con.run(`INSERT INTO ChatUsers (anons_id, chat_id, user_id) VALUES (?, ?, ?)`, anonsid, chatid, chatid);
                con.run(`INSERT INTO ChatUsers (anons_id, chat_id, user_id)
                        SELECT id, ?, author_id FROM anons
                        WHERE id = ?`, chatid, anonsid, (err) => {
                            console.log(err.name + " | " + err.message);
                            throw err;                    
                        });        

                socket.emit('new-chat', {status: 'CREATED'});
            }
        })

        // powiadomienie dla ew. zalogowane drugiego użytkownika,
        // że pojawił się inny rozmówca
        // io.to(chatroom).broadcast('user-enter', {anons: anonsid, chat: chatid, user: chatid });
    });

    socket.on("join-chat", ({anonsid, chatid, userid}) => {
        let chatroom = anonsid + ':' + chatid;

        // sprawdzić, czy user_id ma założony chat ?

        socket.join(chatroom);
        io.to(chatroom).broadcast('user-join', {anonsid, chatid, userid});

        //userSocketMap.get(userid).emit('new-message', {anons: anonsid, chat: chatid, user: userid});
    });


    socket.on("leave-chat", ({ anonsid, chatid, userid }) => {
        let chatroom = anonsid + ':' + chatid;
        socket.leave(chatroom);
        io.to(chatroom).broadcast('user-leave', {anonsid, chatid, userid });
    });


    socket.on("chat-message", ({ anonsid, chatid, userid, msgtext }) => {
        let curDate = Date.now();
        lastMessage++;
        con.run(`INSERT INTO ChatMessages (message_id, anons_id, user_id, message_date, message_text) VALUES
                 (${lastMessage}, ${anonsid}, ${userid}, ${curDate}, "${msgtext}")`);


        // wiadomość do użytkowników podłączonych do pokoju 
        let chatroom = anonsid + ':' + chatid;
        io.to(chatroom).broadcast.emit('chat-message', {anonsid, userid, msgtext});  // zmienić grupę na właściwą dla użytkownika i anonsu

        // dodatkowo powinniśmy powiadomić wszystkich użytkowników (u nas jednego), których to dotyczy,
        // tj. podłączonych do serwera/aplikacji ale nie będących aktualnie w pokoju czatowym,
        // że na czasie pojawiła się nowa wiadomość

        // tabelę ChatUsers można wczytać do pamięci operacyjnej przy uruchamianiu serwera
        // żeby nie robić zapytań SQL przy każdej wiadomośc chat-owej
        con.run('SELECT user_id FROM ChatUsers WHERE anons_id = ? AND chat_id = ?', anonsid, chatid, (err, result) => {
            for (let user in result) {
                let sockid = userSocketMap.get(user.user_id);
                if (sockid != undefined ) {
                    // znajdź socket po socket.id i sprawdź czy jest w pokoju,
                    // jeśli nie to wyślij mu powiadomienie o nowej wiadomości 
                    // w pokoju czatowym

                    io.to(sockid).emit('new-chat-message', {anonsid, chatid, userid, msgtext})
                }
            }
        });
        
    });


    socket.on("chat-image", ({anonsid, userid, image}) => {

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
