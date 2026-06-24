const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
    console.log("a user has connected");

    socket.emit("test event", "test data");
})


server.listen(3000, () => {
    console.log("socket io server is listening");
})