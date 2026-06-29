export class TicTacToe{
    private grid: number[][];

    //turn is either 0 or 1
    private turn: number; //the number will correspond to the chip as well |an outer function will dictate this


    constructor() {
        this.grid = [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]];
        /*
        for(let i = 0; i < 2; i++){
          for(let y = 0; y < 2; y ++){
            this.grid[i][y] = -1;
          }
        }*/
        this.turn = 0;
    }

    setPiece(x: number, y: number, turn: number){
        this.grid[x][y] = turn;
    }

    getGrid(){
        return this.grid;
    }

    /**
     * This function will check if a move is possible. It will return true if its possible, false if its not
     * @param x A number reflecting rows
     * @param y A number reflecting what column
     * @param color A number reflecting what shape/color (depends on how the front end chooses to show this off)
     */
    checkMove(x: number, y:number, color: number){
        return this.grid[x][y] == -1;
    }

    //this function will return whether there is still playable options on the board
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

    checkWin(): number{
        //win condition is 3 in in a row | this can be up/down/diagonal

        console.log("check within a column");
        console.log(this.grid);

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

        console.log("check within a row")
        //check within a column
        for(let i = 0; i <= 2; i++){
            let continues: boolean = true;
            let prev = -1;
            for(let y = 0; y <= 2; y++){
                if(prev === -1 || this.grid[y][i] === prev){
                    prev = this.grid[y][i];
                }
                else{
                    continues = false;
                    break;
                }
            }
            if(continues)
                return prev;
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
