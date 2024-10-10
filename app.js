const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
app.use(express.json()); // Para soportar solicitudes con JSON

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname + "/public")));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/mainMenu2.html');
});


io.on("connection", function (socket) {

    socket.on("joinRoom", function (username, roomId) {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("update", username + "joined the conversation: " + roomId);
    });

    socket.on("chat", function (message, roomId) {
        socket.broadcast.to(roomId).emit("chat", message,);
        console.log(roomId);
    });
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});