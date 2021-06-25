import { KatagoMoveInfo } from "models/Katago";
import { SGFColor, SGFProperties, SGFSnapshot, SGFStone } from "models/SGF";
import React from "react";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

type Point = [number, number];

const DIMENSIONS = (dimension: number, grids: number) => {
    const baseUnit = dimension  / (grids + 2);
    return {
        board: {
            offset: baseUnit / 2,
            dimension: dimension,
            hoshi: 3,
            tengen: 5
        },
        block: {
            dimension: baseUnit,
            offset: baseUnit
        },
        stone: {
            holder: {
                dimension: baseUnit,
                offset: baseUnit * 0.5
            },
            dimension: baseUnit * 0.9 * 0.5,
            offset: baseUnit * 0.45,
            current: {
                dimension: baseUnit * 0.9 * 0.5 * 0.7,
                width: 2
            },
            text: {
                offsetX: 0,
                offsetY: 4
            }
        },
        analysis: {
            ownership: {
                dimension: baseUnit * 0.4,
                offset: baseUnit * 0.2
            },
            policy: {
                dimension: baseUnit * 0.4,
                offset: baseUnit * 0.2
            },
            winrate: {
                offsetY: -2
            },
            lead: {
                offsetY: 8
            }
        }
    }
}

const COLORS = {
    board: {
        color: '#deb887',
    },
    move: {
        border: '#aaaaaa',
        color: '#FCDC05',
        best: '#0C6CD4',
        worst: '#b71c1c',
        nextMoveOpacity: 1,//0.75,
    },
    analysis: {
        policy: {
            color: 'green'
        }
    },
    stone: {
        black: '#000000',
        white: '#fffff3',
        hover: {
            opacity: 0.785
        }
    },
    text: {
        color: '#000000'
    },
    block: {
        color: '#000000',
    }
    
}

const tengen_19 = [9, 9];
const tengen_13 = [6, 6];
const tengen_9 = [4, 4];

const hoshi_19 = [[3, 3], [3, 9], [3, 15],
    [9, 3], [9, 15],
    [15, 3], [15, 9], [15, 15]
];
const hoshi_13 = [[3, 3], [3, 9], [9, 3], [9, 9]];
const hoshi_9 = [[2, 2], [2, 6], [6, 2], [6, 6]];

export default class SvgRenderer {

    private readonly grids: number;
    private readonly sgfProperties: SGFProperties;
    private tengen: number[];
    private hoshi: number[][];
    private readonly dimensionProps: any;
    private readonly colorProps: any;
    private occupiedCoordinates: SGFColor[][];
    private classes: ClassNameMap<string>;

    public constructor(dimension: number, grids: number, sgfProperties: SGFProperties, classes: ClassNameMap<string>) {
        this.grids = grids;
        this.sgfProperties = sgfProperties;
        this.classes = classes;
        this.colorProps = COLORS;
        this.dimensionProps = DIMENSIONS(dimension, grids);
        switch (grids) {
            case 13:
                this.tengen = tengen_13;
                this.hoshi = hoshi_13;
                break;
            case 9:
                this.tengen = tengen_9;
                this.hoshi = hoshi_9;
                break;
            case 19:
            default:
                this.tengen = tengen_19;
                this.hoshi = hoshi_19;
        }
        this.occupiedCoordinates = new Array(grids)
            .fill(SGFColor.NONE)
            .map(() => new Array(grids).fill(SGFColor.NONE));
    }

    private initCoordinates(): void {
        this.occupiedCoordinates = new Array(this.grids)
            .fill(SGFColor.NONE)
            .map(() => new Array(this.grids).fill(SGFColor.NONE));
    }

    public updateRenderer(): void {
        this.initCoordinates();
    }

    public branchElements(snapshot: SGFSnapshot | null): Array<React.SVGProps<SVGRectElement>> {
        const elements = new Array<React.SVGProps<SVGRectElement>>();
        if (snapshot === null) {
            return elements;
        }
        const holderDim = this.dimensionProps.stone.holder;
        const textDim = this.dimensionProps.stone.text;

        snapshot.branches.forEach((branch, index) => {
            const branchSnapshot = branch.snapshotList[0];
            const stone = branchSnapshot.stones[branchSnapshot.stones.length - 1];
            const [i, j] = this.translateToCoordinate(stone[1]);
            const [x, y] = this.loc([i, j]);
            elements.push(<rect key={`stone-holder-br-${stone[1]}`} x={x - holderDim.offset} y={y - holderDim.offset} width={holderDim.dimension} height={holderDim.dimension} fill={this.colorProps.board.color} className={this.classes.stoneHolder}/>);
            elements.push(<text key={`snapshot-text-br-${index}`} x={x - textDim.offsetX} y={y + textDim.offsetY} stroke={this.color('B')}>{branchSnapshot.nodeName}</text>);
            this.markOccupied(i, j, SGFColor.BLACK);
        });
        return elements;
    }

    public hoverElement(stone: { color: string, x: number, y: number}, hoverEffect: boolean): Array<React.SVGProps<SVGRectElement>> {
        const elements = new Array<React.SVGProps<SVGRectElement>>();
        if (!hoverEffect || stone.x === -1 || stone.y === -1 || stone.x === this.grids || stone.y === this.grids) {
            return elements;
        }
        const i = stone.x;
        const j = stone.y;
        if (this.occupiedCoordinates[i][j] === SGFColor.BLACK || this.occupiedCoordinates[i][j] === SGFColor.WHITE) {
            return elements;
        }
        const color = this.color(stone.color);
        const [x, y] = this.loc([i, j]);
        elements.push(<circle key={`stone-hover`} cx={x} cy={y} r={this.dimensionProps.stone.dimension} fill={color} fillOpacity={this.colorProps.stone.hover.opacity}/>);
        
        return elements;
    }

    public ownershipElements(ownership: Array<number>, moveColor: SGFColor): Array<React.SVGProps<SVGRectElement>> {
        const elements = new Array<React.SVGProps<SVGRectElement>>();
        if (!this.sgfProperties.displayOwnership)  {
            return elements;
        }
        const ownershipDim = this.dimensionProps.analysis.ownership;
        ownership.forEach((value, index) => {
            let opacity = Math.abs(value);
            if (opacity < this.sgfProperties.minimumOwnershipValue) {
                return;
            }
            opacity *= 0.5;
            const [i, j] = this.dim(index);
            if (this.isOccupied(i, j) && !this.sgfProperties.situationAnalysisMode) {
                return;
            }
            const [x, y] = this.loc([i, j]);
            const sgfColor = this.ownership(value, moveColor === SGFColor.BLACK);
            const color = this.ownershipColor(sgfColor);
    
            // reverse color on captured stones
            if (this.isOccupied(i, j) && this.sgfProperties.situationAnalysisMode) {
                // skip ownership if there are stone in same color
                if (this.occupiedCoordinates[i][j] === sgfColor) {
                    return;
                } else if ((this.occupiedCoordinates[i][j] === SGFColor.BLACK || this.occupiedCoordinates[i][j] === SGFColor.WHITE) && this.occupiedCoordinates[i][j] !== sgfColor) {
                    opacity *= 2;
                }
            }
            elements.push(<rect key={`ownership-${index}`} x={x - ownershipDim.offset} y={y - ownershipDim.offset}
                    width={ownershipDim.dimension} height={ownershipDim.dimension} fillOpacity={opacity} fill={color}/>);
    
            this.markOccupied(i, j, SGFColor.OCCUPIED);
        });
        return elements;
    }

    public recommendationElements(moves: Array<KatagoMoveInfo>): Array<React.SVGProps<SVGRectElement>> {
        const elements = new Array<React.SVGProps<SVGRectElement>>();
        if (!this.sgfProperties.displayRecommendations && !this.sgfProperties.situationAnalysisMode) {
            return elements;
        }

        const stoneDim = this.dimensionProps.stone;
        const analysisDim = this.dimensionProps.analysis;
        const moveColor = this.colorProps.move;
        const textColor = this.colorProps.text.color;

        for (let index = 0; index < moves.length; index++) {
            const move = moves[index];
            const [i, j] = this.translateToCoordinate(move.move);
            const [x, y] = this.loc([i, j]);
            const color = this.moveColor(index, moves.length);
            elements.push(<circle key={`move-${move.move}`} cx={x} cy={y} r={stoneDim.dimension} fill={color} strokeWidth={1} fillOpacity={moveColor.nextMoveOpacity} stroke={moveColor.boarder}/>);
            elements.push(<text key={`move-winrate-${i}-${j}`} x={x} y={y + analysisDim.winrate.offsetY} stroke={textColor} className={this.classes.svg}>{(move.winrate * 100).toFixed(1)}</text>);
            elements.push(<text key={`move-lead-${i}-${j}`} x={x} y={y + analysisDim.lead.offsetY} stroke={textColor} className={this.classes.svg}>{move.scoreLead.toFixed(1)}</text>);
            this.markOccupied(i, j, SGFColor.OCCUPIED);
        }
        return elements;
    }

    public stoneElements(stones: Array<SGFStone>): Array<React.SVGProps<SVGRectElement>> {
        const elements = new Array<React.SVGProps<SVGRectElement>>();

        const stoneDim = this.dimensionProps.stone;
        const holderDim = stoneDim.holder;
        const currentDim = stoneDim.current;

        stones.forEach((stone, index) => {
            const [i, j] = this.translateToCoordinate(stone[1]);
            const [x, y] = this.loc([i, j]);
            const color = this.color(stone[0]);
            const sgfColor = stone[0] === 'B' ? SGFColor.BLACK : SGFColor.WHITE;
            elements.push(<rect key={`stone-holder-${stone[1]}`} x={x - holderDim.offset} y={y - holderDim.offset} width={holderDim.dimension} height={holderDim.dimension} fill={this.colorProps.board.color} className={this.classes.stoneHolder}/>);
            if (sgfColor === SGFColor.WHITE) {
                elements.push(<circle key={`white-stone-boarder-${stone[1]}`} cx={x} cy={y} r={stoneDim.dimension} strokeWidth={2} stroke={this.oppositeColor(stone[0])} />);
            }
            elements.push(<circle key={`stone-${stone[1]}`} cx={x} cy={y} r={stoneDim.dimension} fill={color}/>);
            if (this.displayMoves()) {
                elements.push(<text key={`snapshot-text-${index}`} x={x - stoneDim.text.offsetX} y={y + stoneDim.text.offsetY} stroke={this.oppositeColor(stone[0])}>{index + 1}</text>);
            }     
            if (this.displayCurrentStone(index, stones)) {
                elements.push(<circle key={`current-stone-${stone[1]}`} cx={x} cy={y} r={currentDim.dimension} strokeWidth={currentDim.width} stroke={this.oppositeColor(stone[0])} fill={color}/>);
            }
            this.markOccupied(i, j, sgfColor);
        });
        return elements;
    }

    private displayCurrentStone(index: number, stones: Array<SGFStone>): boolean {
        return index === stones.length - 1 && !this.sgfProperties.situationAnalysisMode;
    }

    private displayMoves(): boolean {
        return this.sgfProperties.displayMoves && !this.sgfProperties.situationAnalysisMode;
    }

    public policyElements(policy: Array<number>): Array<React.SVGProps<SVGRectElement>> {
        const elements = new Array<React.SVGProps<SVGRectElement>>();
        if (!this.sgfProperties.displayPolicy && !this.sgfProperties.situationAnalysisMode)  {
            return elements;
        }
        const policyDim = this.dimensionProps.analysis.policy;
        policy.forEach((value, index) => {
            if (index === this.grids * this.grids) {
                return;
            }
            if (value === -1) {
                return;
            }
            if (value <= this.sgfProperties.minimumPolicyValue) {
                return;
            }
            const [i, j] = this.dim(index);
            if (this.isOccupied(i, j)) {
                return;
            }
            const opacity = value * 0.5;
            const [x, y] = this.loc([i, j]);                                
            elements.push(<rect key={`policy-${index}`} x={x - policyDim.offset} y={y - policyDim.offset} 
                    width={policyDim.dimension} height={policyDim.dimension} fill={this.colorProps.analysis.policy.color} fillOpacity={opacity}/>);
            this.markOccupied(i, j, SGFColor.OCCUPIED);
        });
        return elements;
    }

    private markOccupied(i: number, j: number, value: SGFColor): void {
        this.occupiedCoordinates[i][j] = value;
    }

    public isOccupied(i: number, j: number): boolean {
        return this.occupiedCoordinates[i][j] !== SGFColor.NONE;
    }

    public boardElements(): Array<React.SVGProps<SVGRectElement>> {
        const lines = new Array<React.SVGProps<SVGRectElement>>();
        const decorations = new Array<React.SVGProps<SVGRectElement>>();

        const boardDim = this.dimensionProps.board;
        const blockDim = this.dimensionProps.block;

        const blockColor = this.colorProps.block.color;

        lines.push(<rect key="bg" width={boardDim.dimension} height={boardDim.dimension} fill={this.colorProps.board.color} pointerEvents={'all'}/>);
        for (let i = 0; i < this.grids; i++) {
            const length = this.grids * blockDim.dimension + boardDim.offset;
            const offset = boardDim.offset + i * blockDim.dimension + blockDim.offset;
    
            // vertical
            lines.push(<line pointerEvents={'none'} key={`line-x-${i}`} x1={boardDim.offset + blockDim.offset} x2={length} y1={offset} y2={offset} stroke={blockColor}/>);
            // 1-19
            const vc = this.grids - i;
            lines.push(<text pointerEvents={'none'} key={`coord-x-${i}`} fontSize={14} x={boardDim.offset + 5} y={offset + 4} stroke={blockColor}>{vc}</text>);
            lines.push(<text pointerEvents={'none'} key={`coord-label-x-${i}`} fontSize={14} x={boardDim.dimension - boardDim.offset - 5} y={offset + 4} stroke={blockColor}>{vc}</text>);
            // horizontal
            lines.push(<line pointerEvents={'none'} key={`line-y-${i}`} x1={offset} x2={offset} y1={boardDim.offset + blockDim.offset} y2={length} stroke={blockColor}/>);
            // A-R
            const hc = String.fromCharCode(65 + (i >= 8 ? i + 1 : i));
            lines.push(<text pointerEvents={'none'} key={`coord-y-${i}`} fontSize={14} x={offset} y={boardDim.offset + 10} stroke={blockColor}>{hc}</text>);
            lines.push(<text pointerEvents={'none'} key={`coord-label-y-${i}`} fontSize={14} x={offset} y={boardDim.dimension - boardDim.offset - 5} stroke={blockColor}>{hc}</text>);
            for (let j = 0; j < this.grids; j++) {
                const [x, y] = this.loc([i, j]);
                if (this.isHoshi([i, j])) {
                    decorations.push(<circle pointerEvents={'none'} key={`hoshi-${i}-${j}`} cx={x} cy={y} r={boardDim.hoshi} stroke={blockColor}/>);
                } else if (this.isTengen([i, j])) {
                    decorations.push(<circle pointerEvents={'none'} key={`tengen`} cx={x} cy={y} r={boardDim.tengen} stroke={blockColor}/>);
                }
            }
        }
        return lines.concat(decorations);
    }

    private isTengen(point: Point): boolean {
        return this.tengen[0] === point[0] && this.tengen[1] === point[1];
    }

    private isHoshi(point: Point): boolean {
        return this.hoshi.some(p => p[0] === point[0] && p[1] === point[1]);
    }

    private dim(index: number): Point {
        //return [this.dimension - 1 - index % this.dimension, Math.floor(index / this.dimension)]; sgf board view
        return [index % this.grids, this.grids - 1 - Math.floor(index / this.grids)];
    }

    private loc(dim: Point): Point {
        const boardDim = this.dimensionProps.board;
        const blockDim = this.dimensionProps.block;
        return [boardDim.offset + blockDim.dimension * dim[0] + blockDim.offset,
            boardDim.offset + blockDim.dimension * dim[1] + blockDim.offset];
    }

    public deloc(loc: Point): Point {
        const boardDim = this.dimensionProps.board;
        const blockDim = this.dimensionProps.block;
        const x = Math.round((loc[0] - blockDim.offset - boardDim.offset) / blockDim.dimension)
        const y = Math.round((loc[1] - blockDim.offset - boardDim.offset) / blockDim.dimension);
        return [this.toBoardCoordinate(x), this.toBoardCoordinate(y)];
    }

    private toBoardCoordinate(coordinate: number): number {
        return coordinate <= 0 ? 0 : coordinate >= this.grids ? this.grids : coordinate;
    }

    private ownership(ownership: number, blackTurn: boolean): SGFColor {
        if (blackTurn) {
            return ownership > 0 ? SGFColor.BLACK : SGFColor.WHITE;
        } else {
            return ownership < 0 ? SGFColor.BLACK : SGFColor.WHITE;
        }
    }

    private ownershipColor(color: SGFColor): string {
        return color === SGFColor.BLACK ? this.colorProps.stone.black : this.colorProps.stone.white;
    }

    private color(color: string): string {
        return color === 'B' ? this.colorProps.stone.black : this.colorProps.stone.white;
    }

    private oppositeColor(color: string): string {
        return color === 'B' ? this.colorProps.stone.white : this.colorProps.stone.black;
    }

    private moveColor(priority: number, totalMoves: number): string {
        const move = this.colorProps.move;
        return priority === 0 ? move.best : priority === totalMoves - 1 ? move.worst : move.color;
    }

    private translateToCoordinate(gtpLocation: string): Point {
        let col = gtpLocation.charCodeAt(0);
        if (col >= 'I'.charCodeAt(0)) {
            col--;
        }
        return [col - 65, Number.parseInt(gtpLocation.substr(1)) - 1];
    }
}