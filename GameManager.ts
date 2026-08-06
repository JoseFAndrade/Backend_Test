import {TicTacToe} from "./TicTacToe";

/**TODO
 *  - integrate sockets id into the player data
 */
export class GameManager{
    private _game: TicTacToe;
    private _roomID;

    //player 1 corresponds to the first member in this list
    private _players = [];
    private _turn:number;

    constructor(roomID: any, p1: any, game:TicTacToe) {
        this._roomID = roomID;
        this._players.push(p1);
        this._game = game;
        this._turn = Math.floor(Math.random() * 2) + 1;
    }

    addPlayer(p: any){
        console.log(this._players.length);
        if(this._players.length < 2)
            this._players.push(p);
        else
            throw Error();
    }

    setStartingTurn(playerTurn: number){
        if( playerTurn != 0 && playerTurn!= 1){
            throw Error();
        }

        this._turn = playerTurn;
    }




    swapTurn(){
        if(this._turn == 1)
            this._turn = 0;
        else
            this._turn = 1;
    }

    getPlayerTurn(){
        return this._players[this._turn];
    }

    /**
     * This function will return true if a move was made and false if it was unable to make a move
     * @param x A number in the grid coordinate
     * @param y A number in the grid coordinate
     */
    playMove(x:number, y:number){
        if(!this._game.checkPlayable()){
            return false;
        }
        this._game.setPiece(x,y, this._turn);
        return true;
    }

    get getGame(): TicTacToe {
        return this._game;
    }

    get roomID() {
        return this._roomID;
    }

    get players(): any[] {
        return this._players;
    }

    get turn(): number {
        return this._turn;
    }
}