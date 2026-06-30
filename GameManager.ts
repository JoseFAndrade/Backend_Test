import {TicTacToe} from "./TicTacToe";

/**TODO
 *  - integrate sockets id into the player data
 */
export class GameManager{
    private game: TicTacToe;
    private roomID;

    //player 1 corresponds to the first member in this list
    private players;
    private turn:number;

    constructor(roomID: any, p1: any, p2: any, game:TicTacToe) {
        this.roomID = roomID;
        this.players.push(p1);
        this.players.push(p2);
        this.game = game;
        this.turn = Math.floor(Math.random() * 2) + 1;

    }
}