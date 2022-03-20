require('dotenv').config();

const express = require('express');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer, {});
const fs = require('fs');


const con = require('./dbCon.js');

let lastMessage, lastImage;

con.run('SELECT MAX(message_id) from ChatMessages', (err, result) => {
    if (err) {
        console.log(err.name + " | " + err.message);
        throw err;
    } else {
        lastMessage = result;
    }
});
con.run('SELECT MAX(image_id) from Images', (err, result) => {
    if (err) {
        console.log(err.name + " | " + err.message);
        throw err;
    } else { 
        lastImage = result;
    }
});


io.on("connection", (socket) => {
    console.log("client connected");

    socket.on("disconnect", () => {
        console.log('client disconnected');

    });


    socket.on("message", ({anonsid, userid, text}) => {
        let curDate = Date.now;
        lastMessage++;
        con.run(`INSERT INTO ChatMessages (message_id, anons_id, user_id, message_date, message_text) VALUES
                 ${lastMessage}, "${anonsid}", "${userid}", "${curDate.getFullYear+'-'+curDate.getMonth+'-'+curDate.getDay}", "${text}"`);

        socket.brodcast.emit('message', {anonsid, userid, text});  // zmienić grupę na właściwą dla użytkownika i anonsu
    });


    socket.on("message_image", ({anonsid, userid, image}) => {

        socket.broadcast.emit('image', {anonsid, userid, image}); // zmienić grupę na właściwą dla użytkownika i anonsu

        let curDate = Date.now;
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
                 ${lastMessage}, "${anonsid}", "${userid}", "${curDate.getFullYear+'-'+curDate.getMonth+'-'+curDate.getDay}", NULL`);
        con.run(`INSERT INTO  (image_id, message_id, user_id, path) VALUES
                ${lastImage}, ${lastMessage}, ${userid}, ${imgPath}`);
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
