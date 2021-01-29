import { TwoDimensionalCodeOne } from "@icon-park/react";
import { SGFColor, SGFStone } from "models/SGF";

export default class GameBoard {

    private dimension: number;
    private board: Array<Array<SGFColor>>;

    public constructor(dimension: number) {
        this.dimension = dimension;
        this.board = this.initBoard();
    }

    private initBoard(): Array<Array<SGFColor>> {
        const board = new Array<Array<SGFColor>>();
        for (let i = 0; i < this.dimension; i++) {
            board.push(new Array<SGFColor>());
            for (let j = 0; j < this.dimension; j++) {
                board[i].push(SGFColor.NONE);
            }
        }
        return board;
    }

    private resetBoard(): void {
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                this.board[i][j] = SGFColor.NONE;
            }
        }
    }

    public updateBoard(stones: Array<SGFStone>): void {
        this.resetBoard();
        stones.forEach((stone, index) => {
            const color = stone[0] === 'B' ? SGFColor.BLACK : SGFColor.WHITE;
            const [x, y] = this.gtpToCoordinate(stone[1]);
            this.board[x][y] = color;
        });
    }

    public isValidMove(color: SGFColor, x: number, y: number): boolean {
        if (this.board[x][y] !== SGFColor.NONE) {
            return false;
        }
        return false;
    }

    private gtpToCoordinate(gtp: string): [number, number] {
        return [this.decodeGTP(gtp.charAt(0).toUpperCase()), 
            parseInt(gtp.charAt(1)) - 1];
    }
    
    private decodeGTP(c: string): number {
        const intValue = parseInt(c);
        if (c >= 'I') {
            return intValue - 1 - 65;
        }
        return intValue - 65;
    }

}