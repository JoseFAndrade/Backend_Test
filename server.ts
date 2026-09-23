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

const io = new Server(server, {cors: {origin: '*', methods: ['GET', 'POST']},
    pingTimeout: 60000,   // Increase ping timeout to 60s if needed
    pingInterval: 25000,  // Interval for heartbeat pings
    connectionStateRecovery: {
        maxDisconnectionDuration: 60 * 1000, // Wait/hold state for 60 seconds
        skipMiddlewares: true,                 // Skip auth middleware on successful recovery
    }});

//const game: TicTacToe = new TicTacToe();

//map is structure of roomId : game: gameManager players: []
const activeTimeouts = new Map();

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

    /**This is here to deal with sockets reconnecting, while it is not a perfect solution it should deal with the way
     * that phone users sockets disconnect when switching applications
     */
    if (socket.recovered) {
        const timeoutId = activeTimeouts.get(socket.id);
        if (timeoutId) {
            clearTimeout(timeoutId);
            activeTimeouts.delete(socket.id);
        }
    }

    /**
     * This socket will listen for an id and create a room with that id. It will then confirm with the user using a
     * callback. Or it will deny it if a room already exists with that id.
     */
    socket.on("createRoom", (id: number, callback) => {
        if(!gameRooms.has(id)){

            socket.join(id.toString());
            //socket.emit("room:created", {roomId: 1, message: "Room has been created"});
            gameRooms.set( id, new GameManager(id, socket.id, new TicTacToe()) );
            callback({status: "ok", message: "Room created with roomId: " + id});
            socket.data.room = id;
        }
        else{
            callback({status: "error", message: "Room already exists. Try to join another room instead."});
        }
    });

    /**
     * This will listen for an id of a room and check if a room of that id has been formed. If it has it will then check
     * if the room has space for the current user. It returns a callback depending on whether the attempt worked or not.
     */
    socket.on("joinRoom", (id: number, callback ) => {
        if(countInRoom(String(id)) >= 2){
            callback({status: "error", message: "The room is currently full of players. Either try to create or join another room."})
            //socket.emit("room:full-players", "Sorry but the room is currently full");
        }
        else{
            if(!gameRooms.has(id)){ //make sure to check if the game room exists
                callback({status: "error", message: "Sorry but the current room that you are trying to join does not exist. Make it instead"});
            }
            else{
                console.log("the id of who joined was: " + socket.id);
                socket.join(id.toString());
                gameRooms.get(id).addPlayer(socket.id);
                //send the data to the client about the board
                socket.emit("player:joined-room", {board: gameRooms.get(id).getGame.getGrid()});
                socket.to(id.toString()).emit("room:player-joined", socket.id,  "A player has joined the room");
                callback({status:'ok', message: "You have successfully joined the room."});

                io.in(id.toString()).emit("game_update:player-turn", gameRooms.get(id).getPlayerTurn());
            }

        }
    });

    /**
     * Added this socket in order to auto delete rooms so that they won't be taking up space on a host closing the tab.
     * In event of the user disconnecting by accident there is a timeout that starts to count down and after a while it
     * will close the connection.
     */
    socket.on("disconnecting", (reason) => {
        if (reason === "transport close" || reason === "ping timeout") {
            const timeoutId = setTimeout(() => {
                gameRooms.delete(socket.data.room);
                activeTimeouts.delete(socket.id);
            }, 60000); // 60 seconds

            activeTimeouts.set(socket.id, timeoutId);
        } else {
            // If the client explicitly closed the connection (e.g., closed tab, called socket.disconnect())
            // run your cleanup code immediately.
            //handlePermanentDisconnect(socket.id);
            gameRooms.delete(socket.data.room);
        }
    });

    /**
     * This will handle all the game move information and sending the data to the logic that keeps the tic-tac-toe
     * game running. It ends up replying with either an error if the move is invalid or an ok if the move was successful.
     * It then relays the information to the rest of the clients connected in the room. It will also always check if
     * the game is over after a move in order to keep users updated and not wait until after another user makes a move.
     * It also handles making sure that the correct user is the one sending the moves.
     */
    socket.on("gameMove", (id: number, moveInfo, callback) => {
        // a check to see if the game room does not exist -> this will only ever run if there is some sort of disconnect issue with the host
        if(!gameRooms.has(id)){
            callback({status: 'error-connection', message: "The connection to the main client has dropped"});
            return;
        }

        let manager = gameRooms.get(id);
        let game = manager.getGame;

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
            callback({status: 'error', message: "Please wait your turn"});
        }
        else{
            var playerId = moveInfo[0];
            var x = moveInfo[1][0];
            var y = moveInfo[1][1];

            if(!game.checkMove(x, y, playerId)){
                callback({status: "error", message: "The move that you are trying to make is invalid."});
            }
            else { //the piece is placeable | update game | send update to connected sockets with room id

                game.setPiece(x,y, playerId);
                callback({status: "ok", message: "The move was successful."});
                manager.swapTurn();
                io.in(id.toString()).emit("game_update:game-move", game.getGrid(), x, y, playerId,  "the player: " + playerId +" has successfully made a move");
                if(!game.checkPlayable()){
                    io.in(id.toString()).emit("game_update:game-end", game.checkWin(), "The game has ended and there are no more actions left");
                }
                else{
                    io.in(id.toString()).emit("game_update:player-turn", gameRooms.get(id).getPlayerTurn());
                }
            }
        }
    })
});


server.listen(3000, () => {
    console.log("socket io server is listening");
})


function countInRoom(room: string) {
    return io.of("/").adapter.rooms.get(room)?.size || 0;
}
