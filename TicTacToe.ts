/**
 * Class that handles the logic relating to the tic-tac-toe game
 */
export class TicTacToe{
    private grid: number[][];

    //turn is either 0 or 1
    private turn: number; //the number will correspond to the chip as well |an outer function will dictate this


    constructor() {
        this.grid = [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]];
        this.turn = 0;
    }

    /**
     * Places a piece in the board
     * @param x A position on the x-axis
     * @param y A position on the y-axis
     * @param turn Whose turn it is. This represents the socket id
     */
    setPiece(x: number, y: number, turn: number){
        this.grid[x][y] = turn;
    }

    /**
     * Returns what the current game looks like.
     */
    getGrid(){
        return this.grid;
    }

    /**
     * This function will check if a move is possible. It will return true if its possible, false if its not
     * @param x A number reflecting rows
     * @param y A number reflecting what column
     * @param userId A number reflecting the id of the user who is making the move
     */
    checkMove(x: number, y:number, userId: number){
        return this.grid[x][y] == -1;
    }


    /**
     * This will check if there is any possible moves left to be made on the board.
     */
    checkPlayable(): boolean{
        if(this.checkWin() !== -1)
            return false;
        for(let i = 0; i <= 2; i++){
            for(let y = 0; y <= 2; y++){
                if(this.grid[i][y] === -1)
                    return true;
            }
        }

        return false;
    }

    /**
     * Returns a winner if there is one. What is being returned is the socket id. If there is no winner then
     * -1 will be returned instead.
     */
    checkWin(): number{
        //win condition is 3 in in a row | this can be up/down/diagonal

        //check within a row
        for(let i = 0; i <= 2; i++){

            let continues: boolean = true;
            let prev = this.grid[i][0];
            for(let y = 0; y <= 2; y++){
                if(prev === this.grid[i][y]){
                    prev = this.grid[i][y];
                    console.log(prev);
                }
                else{
                    continues = false;
                    break;
                }
            }
            if(continues)
                return prev; //returns the number of the winner in this case
        }

        //check within a column
        for(let i = 0; i <= 2; i++){
            let continues: boolean = true;
            let prev = -2;
            for(let y = 0; y <= 2; y++){
                if(prev === -2 || this.grid[y][i] === prev){
                    prev = this.grid[y][i];
                }
                else{
                    continues = false;
                    break;
                }
            }
            if(continues){
                return prev;

            }
        }

        //check diagonal -> just going to hard code it for now because its a 3 by 3
        if(this.grid[0][0] === this.grid[1][1] && this.grid[1][1] === this.grid[2][2])
            return this.grid[0][0];

        if(this.grid[2][0] === this.grid[1][1] && this.grid[1][1] === this.grid[0][2])
            return this.grid[2][0];

        //this means that there will be no winner left
        return -1;
    }


}
