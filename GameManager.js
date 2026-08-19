"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
var GameManager = (function () {
    function GameManager(roomID, p1, game) {
        this._players = [];
        this._roomID = roomID;
        this._players.push(p1);
        this._game = game;
        this._turn = Math.round(Math.random());
        console.log("The turn generated has been: " + this._turn);
    }
    GameManager.prototype.addPlayer = function (p) {
        console.log(this._players.length);
        if (this._players.length < 2)
            this._players.push(p);
        else
            throw Error();
        console.log(this._players);
    };
    GameManager.prototype.setStartingTurn = function (playerTurn) {
        if (playerTurn != 0 && playerTurn != 1) {
            throw Error();
        }
        this._turn = playerTurn;
    };
    GameManager.prototype.swapTurn = function () {
        if (this._turn == 1)
            this._turn = 0;
        else
            this._turn = 1;
    };
    GameManager.prototype.getPlayerTurn = function () {
        return this._players[this._turn];
    };
    GameManager.prototype.playMove = function (x, y) {
        if (!this._game.checkPlayable()) {
            return false;
        }
        this._game.setPiece(x, y, this._turn);
        return true;
    };
    Object.defineProperty(GameManager.prototype, "getGame", {
        get: function () {
            return this._game;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameManager.prototype, "roomID", {
        get: function () {
            return this._roomID;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameManager.prototype, "players", {
        get: function () {
            return this._players;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameManager.prototype, "turn", {
        get: function () {
            return this._turn;
        },
        enumerable: false,
        configurable: true
    });
    return GameManager;
}());
exports.GameManager = GameManager;
//# sourceMappingURL=GameManager.js.map