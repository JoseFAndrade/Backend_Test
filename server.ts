import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
// @ts-ignore
import cors from 'cors';
import {TicTacToe} from "./TicTacToe";
import {GameManager} from "./GameManager";

const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // Match with your frontend URL
app.use(express.json());

const server = createServer(app);

const io = new Server(server, {cors: {origin: '*', methods: ['GET', 'POST']}});

//const game: TicTacToe = new TicTacToe();

//map is structure of roomId : game: gameManager players: []

const gameRooms = new Map<number, GameManager>();
/*TODO
    -add verification to the backend server where it needs to confirm if a user is able to make a move
        -make sure its actually their turn
    -add more information to the responses that the server gives back
        -need to figure this out over time
    -after we are done with using postman as a testing service
        -integrate needing to check if a socket is within the room that they want to make a move in
        -assign sockets to a specific player
        -currently not using it because it would mess with testing out the postman since front end is not done yet
    -figure out when is the right time to do a room wide response vs a socket response
        -do i let the entire room know of the move the opponent tried to make that is not possible?
            -maybe we let this one be just for the socket
                -integrate this after postman is removed due to the limiting factors in easy 8testing
    ---------------
    what is done
        - backend able to detect when a game has ended and respond
        - backend able to detect when a move is not possible
 */

io.on('connection', (socket) => {
    console.log("a user has connected");
    socket.on("test", (arg) => {
        console.log("1");
        socket.emit("yes", "yes");
    });

    socket.on("createRoom", (id: number, callback) => {
        console.log("create room ran");
        console.log(id);

        if(!gameRooms.has(id)){
            console.log("unique");
            console.log("Room has the id: " + id);
            console.log("the id of who joined was: " + socket.id);
            socket.join(id.toString());
            //socket.emit("room:created", {roomId: 1, message: "Room has been created"});
            gameRooms.set( id, new GameManager(id, socket.id, new TicTacToe()) );
            callback({status: "ok", message: "Room created with roomId: " + id});
        }
        else{
            console.log("throw error");
            callback({status: "error", message: "Room already exists. Try to join another room instead."});
        }
    });

    //we need to keep the emit here because its going to be necessary for the receiving of data to happen
    socket.on("joinRoom", (id: number, callback ) => {
        if(countInRoom(String(id)) >= 2){
            console.log("Room is full");
            callback({status: "error", message: "The room is currently full of players. Either try to create or join another room."})
            //socket.emit("room:full-players", "Sorry but the room is currently full");
        }
        else{
            console.log("join room ran");
            if(!gameRooms.has(id)){ //make sure to check if the game room exists
                console.log("room does not exist");

                callback({status: "error", message: "Sorry but the current room that you are trying to join does not exist. Make it instead"});
            }
            else{
                console.log("the id of who joined was: " + socket.id);
                socket.join(id.toString());
                gameRooms.get(id).addPlayer(socket.id);
                //send the data to the client about the board
                socket.emit("player:joined-room", {board: gameRooms.get(id).getGame.getGrid()});
                console.log(socket.id);
                socket.to(id.toString()).emit("room:player-joined", socket.id,  "A player has joined the room");
                callback({status:'ok', message: "You have successfully joined the room."});

                io.in(id.toString()).emit("game_update:player-turn", gameRooms.get(id).getPlayerTurn());
            }

        }
    });

    //this socket will handle game moves
    //going to assume for now that move info is some sort of [[x,y], turnNumber]
    socket.on("gameMove", (id: number, moveInfo, callback) => {

        console.log("game move ran");
        let manager = gameRooms.get(id);
        let game = manager.getGame;

        console.log(manager.getPlayerTurn());
        console.log(typeof manager.getPlayerTurn());
        console.log(socket.id);
        console.log(typeof socket.id);

        if(manager.players.length !== 2){
            callback({status: "error-two", message:"Not enough players"});
        }
        else if(!game.checkPlayable()) {
            callback({status:"error", message: "The game has ended"});

            //update the lobby in game ended state
            io.in(id.toString()).emit("game_update:game-end", game.checkWin(), "The game has ended and there are no more actions left");
        }
        //else if(game.getTurn() === moveInfo[1]){
        else if(!(manager.getPlayerTurn() === socket.id.trim())) { //check to make sure that the current players turn socket id is the same as the msg socket id
            //TODO need to make sure to test out how to do this in a different ways | socket checking but after postman
            callback({status: 'error', message: "Please wait your turn"});
            //socket.emit("game_update:illegal-move", "Please wait for your turn. It is not your turn yet");
        }
        else{
            var playerId = moveInfo[0];
            var x = moveInfo[1][0];
            var y = moveInfo[1][1];

            if(!game.checkMove(x, y, playerId)){
                //add move details to the response
                //io.in(id).emit("game_update:invalid-move", "The move is invalid because the select position is not open.", moveInfo);
                callback({status: "error", message: "The move that you are trying to make is invalid."});
            }
            else { //the piece is placeable | update game | send update to connected sockets with room id

                game.setPiece(x,y, playerId);
                callback({status: "ok", message: "The move was successful."});
                manager.swapTurn();
                //update the room with the move
                //io.to(id.toString()).emit("game_update:game-move", "testing");
                io.in(id.toString()).emit("game_update:game-move", game.getGrid(), x, y, playerId,  "the player: " + playerId +" has successfully made a move");
                io.in(id.toString()).emit("game_update:player-turn", gameRooms.get(id).getPlayerTurn());
            }
        }
    })
})


server.listen(3000, () => {
    console.log("socket io server is listening");
})


function countInRoom(room: string) {
    return io.of("/").adapter.rooms.get(room)?.size || 0;
}
