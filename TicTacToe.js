"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicTacToe = void 0;
var TicTacToe = (function () {
    function TicTacToe() {
        this.grid = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
        this.turn = 0;
    }
    TicTacToe.prototype.setPiece = function (x, y, turn) {
        this.grid[x][y] = turn;
    };
    TicTacToe.prototype.getGrid = function () {
        return this.grid;
    };
    TicTacToe.prototype.checkMove = function (x, y, userId) {
        return this.grid[x][y] == -1;
    };
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
                return prev;
        }
        for (var i = 0; i <= 2; i++) {
            var continues = true;
            var prev = -2;
            for (var y = 0; y <= 2; y++) {
                if (prev === -2 || this.grid[y][i] === prev) {
                    prev = this.grid[y][i];
                }
                else {
                    continues = false;
                    break;
                }
            }
            if (continues) {
                return prev;
            }
        }
        if (this.grid[0][0] === this.grid[1][1] && this.grid[1][1] === this.grid[2][2])
            return this.grid[0][0];
        if (this.grid[2][0] === this.grid[1][1] && this.grid[1][1] === this.grid[0][2])
            return this.grid[2][0];
        return -1;
    };
    return TicTacToe;
}());
exports.TicTacToe = TicTacToe;
//# sourceMappingURL=TicTacToe.js.map