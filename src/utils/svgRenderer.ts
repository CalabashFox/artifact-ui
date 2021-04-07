import { SGFColor, SGFProperties } from "models/SGF";

type Point = [number, number];

export interface SVGProperties {
    boardOffset: number
    dim: number
    boardColor: string
    blockDim: number
    blockOffset: number
    blockColor: string
    hoshiDim: number
    tengenDim: number
    blackColor: string
    whiteColor: string
    stoneHolderDim: number
    stoneHolderOffset: number
    currentStoneDim: number
    currentStoneWidth: number
    stoneDim: number
    stoneOffset: number
    stoneTextOffset: number
    stoneTextOffsetY: number
    ownershipDim: number
    ownershipOffset: number
    textColor: string
    winrateOffsetY: number
    leadOffsetY: number
    nextMoveOpacity: number
    moveBoarderColor: string
    moveColor: string
    bestMoveColor: string
    worstMoveColor: string
}

export default class SvgRenderer {

    private readonly dimension: number;
    private readonly svgProps: SVGProperties;
    private readonly sgfProperties: SGFProperties;

    public constructor(dimension: number, svgProps: SVGProperties, sgfProperties: SGFProperties) {
        this.dimension = dimension;
        this.svgProps = svgProps;
        this.sgfProperties = sgfProperties;
    }

    getSgfProperties(): SGFProperties {
        return this.sgfProperties;
    }

    getBoardDimension(): number {
        return this.dimension;
    }

    dim(index: number): Point {
        //return [this.dimension - 1 - index % this.dimension, Math.floor(index / this.dimension)]; sgf board view
        return [index % this.dimension, this.dimension - 1 - Math.floor(index / this.dimension)];
    }

    loc(dim: [number, number]): Point {
        return [this.svgProps.boardOffset + this.svgProps.blockDim * dim[0] + this.svgProps.blockOffset,
            this.svgProps.boardOffset + this.svgProps.blockDim * dim[1] + this.svgProps.blockOffset];
    }

    deloc(loc: [number, number]): Point {
        const x = Math.round((loc[0] - this.svgProps.blockOffset - this.svgProps.boardOffset) / this.svgProps.blockDim)
        const y = Math.round((loc[1] - this.svgProps.blockOffset - this.svgProps.boardOffset) / this.svgProps.blockDim);
        return [this.toBoardCoordinate(x), this.toBoardCoordinate(y)];
    }

    toBoardCoordinate(coordinate: number): number {
        return coordinate <= 0 ? 0 : coordinate >= 19 ? 19 : coordinate;
    }

    ownership(ownership: number, blackTurn: boolean): SGFColor {
        if (blackTurn) {
            return ownership > 0 ? SGFColor.BLACK : SGFColor.WHITE;
        } else {
            return ownership < 0 ? SGFColor.BLACK : SGFColor.WHITE;
        }
    }

    ownershipColor(color: SGFColor): string {
        return color === SGFColor.BLACK ? this.svgProps.blackColor : this.svgProps.whiteColor;
    }

    color(color: string): string {
        return color === 'B' ? this.svgProps.blackColor : this.svgProps.whiteColor;
    }

    oppositeColor(color: string): string {
        return color === 'B' ? this.svgProps.whiteColor : this.svgProps.blackColor;
    }

    moveColor(priority: number, totalMoves: number): string {
        return priority === 0 ? this.svgProps.bestMoveColor 
            : priority === totalMoves - 1 ? this.svgProps.worstMoveColor : this.svgProps.moveColor;
    }
}