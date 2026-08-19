"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicTacToe = void 0;
var TicTacToe = /** @class */ (function () {
    function TicTacToe() {
        this.grid = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
        /*
        for(let i = 0; i < 2; i++){
          for(let y = 0; y < 2; y ++){
            this.grid[i][y] = -1;
          }
        }*/
        this.turn = 0;
    }
    TicTacToe.prototype.setPiece = function (x, y, turn) {
        this.grid[x][y] = turn;
    };
    TicTacToe.prototype.swithTurn = function () {
        if (this.turn === 1)
            this.turn = 0;
        else
            this.turn = 1;
    };
    TicTacToe.prototype.getTurn = function () {
        return this.turn;
    };
    TicTacToe.prototype.getGrid = function () {
        return this.grid;
    };
    /**
     * This function will check if a move is possible. It will return true if its possible, false if its not
     * @param x A number reflecting rows
     * @param y A number reflecting what column
     * @param userId A number reflecting the id of the user who is making the move
     */
    //todo I need to start to move these things over to the game manager because that is what will be in charge of all of this
    TicTacToe.prototype.checkMove = function (x, y, userId) {
        return this.grid[x][y] == -1;
    };
    //this function will return whether there is still playable options on the board
    TicTacToe.prototype.checkPlayable = function () {
        if (this.checkWin() !== -1)
            return false;
        for (var i = 0; i <= 2; i++) {
            for (var y = 0; y <= 2; y++) {
                if (this.grid[i][y] === -1)
                    return true;
            }
        }
        return false;
    };
    TicTacToe.prototype.checkWin = function () {
        //win condition is 3 in in a row | this can be up/down/diagonal
        console.log("check within a column");
        console.log(this.grid);
        //check within a row
        for (var i = 0; i <= 2; i++) {
            var continues = true;
            var prev = this.grid[i][0];
            for (var y = 0; y <= 2; y++) {
                if (prev === this.grid[i][y]) {
                    prev = this.grid[i][y];
                    console.log(prev);
                }
                else {
                    continues = false;
                    break;
                }
            }
            if (continues)
                return prev; //returns the number of the winner in this case
        }
        console.log("check within a row");
        //check within a column
        for (var i = 0; i <= 2; i++) {
            var continues = true;
            var prev = -1;
            for (var y = 0; y <= 2; y++) {
                if (prev === -1 || this.grid[y][i] === prev) {
                    prev = this.grid[y][i];
                }
                else {
                    continues = false;
                    break;
                }
            }
            if (continues)
                return prev;
        }
        //check diagonal -> just going to hard code it for now because its a 3 by 3
        if (this.grid[0][0] === this.grid[1][1] && this.grid[1][1] === this.grid[2][2])
            return this.grid[0][0];
        if (this.grid[2][0] === this.grid[1][1] && this.grid[1][1] === this.grid[0][2])
            return this.grid[2][0];
        //this means that there will be no winner left
        return -1;
    };
    return TicTacToe;
}());
exports.TicTacToe = TicTacToe;
