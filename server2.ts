import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
// @ts-ignore
import cors from 'cors';
import {TicTacToe} from "./TicTacToe";

const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // Match with your frontend URL
app.use(express.json());

const server = createServer(app);

const io = new Server(server, {cors: {origin: '*', methods: ['GET', 'POST']}});

const game: TicTacToe = new TicTacToe();

/*TODO
    -add verification to the backend server where it needs to confirm if a user is able to make a move
        -make sure its actually their turn
    -add more information to the responses that the server gives back
        -need to figure this out over time
    -after we are done with using postman as a testing service
        -integrate needing to check if a socket is within the room that they want to make a move in
        -currently not using it because it would mess with testing out the postman since front end is not done yet
    -figure out when is the right time to do a room wide response vs a socket response
        -do i let the entire room know of the move the opponent tried to make that is not possible?
            -maybe we let this one be just for the socket
                -integrate this after postman is removed due to the limiting factors in easy testing
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

    socket.on("createRoom", ({id, data}) => {
        console.log("create room ran");
        console.log(id);
        console.log(data);
        socket.join(id);

        socket.emit("room:created", "Room has been created");

        socket.to(id).emit("room:player-joined", "a player has joined the room");
    });

    socket.on("joinRoom", ({id, data}) => {
        console.log("join room ran");
        socket.join(id);
        socket.emit("player:joined-room", {board: game.getGrid()});
        socket.to(id).emit("room:player-joined", "a player has joined the room");
    });

    //this socket will handle game moves
    //going to assume for now that move info is some sort of [[x,y], turnNumber]
    socket.on("gameMove", ({id, moveInfo}) => {
        console.log("game move");
        if(!game.checkPlayable())
            io.in(id).emit("game_update:game-end", "The game has ended and there are no more actions left", game.checkWin());
        else{
            var position = moveInfo[0];
            var color = moveInfo[1];

            if(!game.checkPlayable()){
                io.in(id).emit("game_update:game-end", "The game has ended and there are no more actions left", game.checkWin());
            }
            else if(!game.checkMove(position[0], position[1], color)){
                //add move details to the response
                io.in(id).emit("game_update:invalid-move", "The move is invalid because the select position is not open.",
                    moveInfo);
            }
            else { //the piece is placeable | update game | send update to connected sockets with room id
                game.setPiece(position[0], position[1], color);
                io.in(id).emit("game_update:game-move", game.getGrid());
            }
        }

    })



    socket.emit("test event", "test data");
})


server.listen(3000, () => {
    console.log("socket io server is listening");
})

