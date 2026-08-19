"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var cors_1 = __importDefault(require("cors"));
var TicTacToe_1 = require("./TicTacToe");
var GameManager_1 = require("./GameManager");
var app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: 'http://localhost:3000' }));
app.use(express_1.default.json());
var server = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
var gameRooms = new Map();
io.on('connection', function (socket) {
    console.log("a user has connected");
    socket.on("test", function (arg) {
        console.log("1");
        socket.emit("yes", "yes");
    });
    socket.on("createRoom", function (id, callback) {
        console.log("create room ran");
        console.log(id);
        if (!gameRooms.has(id)) {
            console.log("unique");
            console.log("Room has the id: " + id);
            console.log("the id of who joined was: " + socket.id);
            socket.join(id.toString());
            gameRooms.set(id, new GameManager_1.GameManager(id, socket.id, new TicTacToe_1.TicTacToe()));
            callback({ status: "ok", message: "Room created with roomId: " + id });
        }
        else {
            console.log("throw error");
            callback({ status: "error", message: "Room already exists. Try to join another room instead." });
        }
    });
    socket.on("joinRoom", function (id, callback) {
        if (countInRoom(String(id)) >= 2) {
            console.log("Room is full");
            callback({ status: "error", message: "The room is currently full of players. Either try to create or join another room." });
        }
        else {
            console.log("join room ran");
            if (!gameRooms.has(id)) {
                console.log("room does not exist");
                callback({ status: "error", message: "Sorry but the current room that you are trying to join does not exist. Make it instead" });
            }
            else {
                console.log("the id of who joined was: " + socket.id);
                socket.join(id.toString());
                gameRooms.get(id).addPlayer(socket.id);
                socket.emit("player:joined-room", { board: gameRooms.get(id).getGame.getGrid() });
                console.log(socket.id);
                socket.to(id.toString()).emit("room:player-joined", socket.id, "A player has joined the room");
                callback({ status: 'ok', message: "You have successfully joined the room." });
                io.in(id.toString()).emit("game_update:first-player", gameRooms.get(id).getPlayerTurn());
            }
        }
    });
    socket.on("gameMove", function (id, moveInfo, callback) {
        console.log("game move ran");
        var manager = gameRooms.get(id);
        var game = manager.getGame;
        console.log(manager.getPlayerTurn());
        console.log(typeof manager.getPlayerTurn());
        console.log(socket.id);
        console.log(typeof socket.id);
        if (manager.players.length !== 2) {
            callback({ status: "error-two", message: "Not enough players" });
        }
        else if (!game.checkPlayable()) {
            callback({ status: "error", message: "The game has ended" });
            io.in(id.toString()).emit("game_update:game-end", game.checkWin(), "The game has ended and there are no more actions left");
        }
        else if (!(manager.getPlayerTurn() === socket.id.trim())) {
            callback({ status: 'error', message: "Please wait your turn" });
        }
        else {
            var playerId = moveInfo[0];
            var x = moveInfo[1][0];
            var y = moveInfo[1][1];
            if (!game.checkMove(x, y, playerId)) {
                callback({ status: "error", message: "The move that you are trying to make is invalid." });
            }
            else {
                game.setPiece(x, y, playerId);
                callback({ status: "ok", message: "The move was successful." });
                manager.swapTurn();
                io.in(id.toString()).emit("game_update:game-move", game.getGrid(), x, y, playerId, "the player: " + playerId + " has successfully made a move");
            }
        }
    });
});
server.listen(3000, function () {
    console.log("socket io server is listening");
});
function countInRoom(room) {
    var _a;
    return ((_a = io.of("/").adapter.rooms.get(room)) === null || _a === void 0 ? void 0 : _a.size) || 0;
}
//# sourceMappingURL=server.js.map