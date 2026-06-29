const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
//import {TicTacToe} from "./TicTacToe.ts";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const games = new Map();
/** TODO
 * I will need to start by making a front end that can allow to join/create specific rooms
 * Then I will need to start by populating the map with games
 *  Then I will need to sync the data across the players and deal with that
 *  I wonder if I can start with a simple test to make sure that the game syncing is working first before
 *      I deal with the creation of specific rooms/joining rooms
 */

//const game = new TicTacToe();


io.on('connection', (socket) => {
    console.log("a user has connected");

    socket.on("test", (arg) => {
        console.log("1");
        socket.emit("yes", "yes");
    })


    socket.emit("test event", "test data");
})


server.listen(3000, () => {
    console.log("socket io server is listening");
})

