import React, {ReactElement, useState} from "react";
import {useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import {makeStyles} from '@material-ui/core/styles';
import SgfUtils from 'utils/sgfUtils';
import SvgRenderer from 'utils/svgRenderer';
import { SGFStone } from "models/SGF";
import { KatagoMoveInfo } from "models/Katago";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'inline-block',
        position: 'relative',
        width: '100%'
    },
    dummy: {
        marginTop: '100%'
    },
    element: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        //backgroundColor: '#ffa54f',
        backgroundColor: '#deb887',
        borderRadius: '2px',
        padding: theme.spacing(2),
    },
    boardContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(19, 1fr)',
        gridGap: theme.spacing(0),
    },
    block: {
        border: '1px solid black'
    },
    font: {
        fontSize: 10,
        fontWeight: 100,
        fontFamily: 'Courier New, monospace',
        textAnchor: 'middle'
    }
}));

const BASE_DIM = 30;

const svgProps = {
    dim: 600,
    boardColor: '#deb887',
    blockDim: BASE_DIM,
    blockOffset: BASE_DIM,
    blockColor: '#000',
    hoshiDim: 3,
    tengenDim: 5,
    blackColor: '#000',
    whiteColor: '#fff',
    stoneHolderDim: BASE_DIM,
    stoneHolderOffset: BASE_DIM * 0.5,
    stoneDim: BASE_DIM * 0.9 * 0.5, // radius
    stoneOffset: BASE_DIM * 0.45,
    currentStoneDim: BASE_DIM * 0.9 * 0.5 * 0.7,
    currentStoneWidth: 2,
    stoneTextOffset: 0,
    stoneTextOffsetY: 4,
    ownershipDim: BASE_DIM * 0.5,
    ownershipOffset: BASE_DIM * 0.25,
    textColor: '#000',
    winrateOffsetY: -4,
    leadOffsetY: 10,
    nextMoveOpacity: 0.75,
    moveBoarderColor: '#aaa',
    moveColor: '#FCDC05',
    bestMoveColor: '#0C6CD4',
    worstMoveColor: '#b71c1c'
}

interface SGFBoardProperties {
    click: (x: number, y: number) => void
    currentMove: number
    stones: Array<SGFStone>
    policy: Array<number>
    ownership: Array<number>
    moveInfos: Array<KatagoMoveInfo>
    hoverEffect: boolean
}

const createHoverStone = (svgRenderer: SvgRenderer, stone: HoverStone, hoverEffect: boolean): Array<React.SVGProps<SVGRectElement>> => {
    const hoverStones = new Array<React.SVGProps<SVGRectElement>>();
    if (!hoverEffect || stone.x === -1 || stone.y === -1 || stone.x === 19 || stone.y === 19) {
        return hoverStones;
    }
    const i = stone.x;
    const j = stone.y;
    const color = svgRenderer.color(stone.color);
    const [x, y] = svgRenderer.loc([i, j]);
    hoverStones.push(<circle key={`stone-hover`} cx={x} cy={y} r={svgProps.stoneDim} fill={color} fillOpacity={0.75}/>);
    
    return hoverStones;
}

const createSVGStones = (svgRenderer: SvgRenderer, occupiedCoordinates: boolean[][], stones: Array<SGFStone>): Array<React.SVGProps<SVGRectElement>> => {
    const svgStones = new Array<React.SVGProps<SVGRectElement>>();
    stones.forEach((stone, index) => {
        const [i, j] = SgfUtils.translateToCoordinate(stone[1]);
        const [x, y] = svgRenderer.loc([i, j]);
        const color = svgRenderer.color(stone[0]);
        svgStones.push(<rect key={`stone-holder-${stone[1]}`} x={x - svgProps.stoneHolderOffset} y={y - svgProps.stoneHolderOffset} width={svgProps.stoneHolderDim} height={svgProps.stoneHolderDim} fill={svgProps.boardColor}/>);
        if (stone[0] === 'W') {
            //stones.push(<circle key={`white-stone-boarder-${stone[1]}`} cx={x} cy={y} r={svgProps.stoneDim} strokeWidth={2} stroke={svgRenderer.oppositeColor(stone[0])} />);
        }
        svgStones.push(<circle key={`stone-${stone[1]}`} cx={x} cy={y} r={svgProps.stoneDim} fill={color}/>);
        if (!svgRenderer.getSgfProperties().displayMoves) {
            svgStones.push(<text key={`snapshot-text-${index}`} x={x - svgProps.stoneTextOffset} y={y + svgProps.stoneTextOffsetY} stroke={svgRenderer.oppositeColor(stone[0])}>{index + 1}</text>);
        }     
        if (index === stones.length - 1) {
            svgStones.push(<circle key={`current-stone-${stone[1]}`} cx={x} cy={y} r={svgProps.currentStoneDim} strokeWidth={svgProps.currentStoneWidth} stroke={svgRenderer.oppositeColor(stone[0])} fill={color}/>);
        }
        occupiedCoordinates[i][j] = true;
    });
    return svgStones;
}

const createSVGPoliy = (svgRenderer: SvgRenderer, occupiedCoordinates: boolean[][], policy: Array<number>): Array<React.SVGProps<SVGRectElement>> => {
    const svgPolicy = new Array<React.SVGProps<SVGRectElement>>();
    if (!svgRenderer.getSgfProperties().displayPolicy)  {
        return svgPolicy;
    }
    policy.forEach((value, index) => {
        if (index === 19 * 19) {
            return;
        }
        if (value === -1) {
            return;
        }
        if (value <= svgRenderer.getSgfProperties().minimumPolicyValue) {
            return;
        }
        const [i, j] = svgRenderer.dim(index);
        if (occupiedCoordinates[i][j]) {
            return;
        }
        const opacity = value * 0.5;
        const [x, y] = svgRenderer.loc([i, j]);
        svgPolicy.push(<rect key={`policy-${index}`} x={x - svgProps.ownershipOffset} y={y - svgProps.ownershipOffset}
                            width={svgProps.ownershipDim} height={svgProps.ownershipDim} fill={'green'} fillOpacity={opacity}/>);
        occupiedCoordinates[i][j] = true;
    });
    return svgPolicy;
}

const createSVGOwnership = (svgRenderer: SvgRenderer, occupiedCoordinates: boolean[][], ownership: Array<number>): Array<React.SVGProps<SVGRectElement>> => {
    const svgOwnership = new Array<React.SVGProps<SVGRectElement>>();
    if (!svgRenderer.getSgfProperties().displayOwnership)  {
        return svgOwnership;
    }
    ownership.forEach((value, index) => {
        let opacity = Math.abs(value);
        if (opacity < 0.1) { // TODO make this as settings
            return;
        }
        opacity *= 0.5;
        const [i, j] = svgRenderer.dim(index);
        if (occupiedCoordinates[i][j]) {
            return;
        }
        const [x, y] = svgRenderer.loc([i, j]);
        const color = svgRenderer.ownershipColor(value);
        svgOwnership.push(<rect key={`ownership-${index}`} x={x - svgProps.ownershipOffset} y={y - svgProps.ownershipOffset}
                            width={svgProps.ownershipDim} height={svgProps.ownershipDim} fillOpacity={opacity} fill={color}/>);
        occupiedCoordinates[i][j] = true;
    });
    return svgOwnership;
}

const createSVGMoves = (svgRenderer: SvgRenderer, occupiedCoordinates: boolean[][], moves: Array<KatagoMoveInfo>): Array<React.SVGProps<SVGRectElement>> => {
    const svgMoves = new Array<React.SVGProps<SVGRectElement>>();
    for (let index = 0; index < moves.length; index++) {
        const move = moves[index];
        const [i, j] = SgfUtils.translateToCoordinate(move.move);
        const [x, y] = svgRenderer.loc([i, j]);
        const color = svgRenderer.moveColor(index, moves.length);
        svgMoves.push(<circle key={`move-${move.move}`} cx={x} cy={y} r={svgProps.stoneDim} fill={color} strokeWidth={1} fillOpacity={svgProps.nextMoveOpacity} stroke={svgProps.moveBoarderColor}/>);
        svgMoves.push(<text key={`move-winrate-${i}-${j}`} x={x} y={y + svgProps.winrateOffsetY} stroke={svgProps.textColor}>{(move.winrate * 100).toFixed(1)}</text>);
        svgMoves.push(<text key={`move-lead-${i}-${j}`} x={x} y={y + svgProps.leadOffsetY} stroke={svgProps.textColor}>{move.scoreLead.toFixed(1)}</text>);
        occupiedCoordinates[i][j] = true;
    }
    return svgMoves;
}

const createSVGBoard = (svgRenderer: SvgRenderer, occupiedCoordinates: boolean[][]): Array<React.SVGProps<SVGRectElement>> => {
    const svgLines = new Array<React.SVGProps<SVGRectElement>>();
    const svgDecorations = new Array<React.SVGProps<SVGRectElement>>();
    const dimension = svgRenderer.getBoardDimension();
    for (let i = 0; i < dimension; i++) {
        const length = dimension * svgProps.blockDim;
        const offset = i * svgProps.blockDim + svgProps.blockOffset;

        occupiedCoordinates[i] = [];
        // vertical
        svgLines.push(<line pointerEvents={'none'} key={`line-x-${i}`} x1={svgProps.blockOffset} x2={length} y1={offset} y2={offset} stroke={svgProps.blockColor}/>);
        // horizontal
        svgLines.push(<line pointerEvents={'none'} key={`line-y-${i}`} x1={offset} x2={offset} y1={svgProps.blockOffset} y2={length} stroke={svgProps.blockColor}/>);
        for (let j = 0; j < dimension; j++) {
            const [x, y] = svgRenderer.loc([i, j]);
            if (SgfUtils.isHoshi([i, j])) {
                svgDecorations.push(<circle pointerEvents={'none'} key={`hoshi-${i}-${j}`} cx={x} cy={y} r={svgProps.hoshiDim} stroke={svgProps.blockColor}/>);
            }
            if (SgfUtils.isTengen([i, j])) {
                svgDecorations.push(<circle pointerEvents={'none'} key={`tengen`} cx={x} cy={y} r={svgProps.tengenDim} stroke={svgProps.blockColor}/>);
            }
        }
    }
    return svgLines.concat(svgDecorations);
}

interface HoverStone {
    color: string
    x: number
    y: number
}

export default function SGFBoard(props: SGFBoardProperties): ReactElement {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const sgfProperties = sgfState.sgfProperties;
    const dimension = 19;
    const {click, stones, policy, ownership, moveInfos, hoverEffect} = props;

    const blackTurn = stones.length === 0 ? true : 
        stones[stones.length - 1][0] === 'B' ? false : true;

    const svgRenderer = new SvgRenderer(dimension, svgProps, sgfProperties);

    const [hoverStone, setHoverStone] = useState({
        color: 'B',
        x: -1,
        y: -1
    });

    const transformLocation = (event: React.MouseEvent<SVGSVGElement, MouseEvent>): [number, number] => {
        const svg = event.currentTarget;
        const pt = svg.createSVGPoint();
      
        pt.x = event.clientX;
        pt.y = event.clientY;
      
        const ctm = svg.getScreenCTM();
        if (ctm) {
            const cursorPt = pt.matrixTransform(ctm.inverse());
            return svgRenderer.deloc([cursorPt.x, cursorPt.y]);
        } else {
            return svgRenderer.deloc([pt.x, pt.y]); 
        }
    }

    const handleClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const [x, y] = transformLocation(event);
        click(x, y);
    };

    const handleMouseOut = () => {
        if (!hoverEffect) {
            return;
        }
        setHoverStone({
            color: blackTurn ? 'B' : 'W',
            x: -1,
            y: -1
        });
    };

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (!hoverEffect) {
            return;
        }
        const [x, y] = transformLocation(event);
        if (hoverStone.x === x && hoverStone.y === y) {
            return;
        }
        setHoverStone({
            color: blackTurn ? 'B' : 'W',
            x: x,
            y: y
        });
    };

    const occupiedCoordinates: boolean[][] = [];
    const svgBoardDecorations = createSVGBoard(svgRenderer, occupiedCoordinates);
    const svgStones = createSVGStones(svgRenderer, occupiedCoordinates, stones);
    const svgMoves = createSVGMoves(svgRenderer, occupiedCoordinates, moveInfos);
    const svgOwnership = createSVGOwnership(svgRenderer, occupiedCoordinates, ownership);
    const svgPolicy = createSVGPoliy(svgRenderer, occupiedCoordinates, policy);
    const svgHoverStones = createHoverStone(svgRenderer, hoverStone, hoverEffect);

    return <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" className={classes.font}
        pointerEvents={'none'}
        onClick={(e) => handleClick(e)} 
        onMouseOut={() => handleMouseOut()}
        onMouseMove={(e) => handleMouseMove(e)}>
        <rect width={svgProps.dim} height={svgProps.dim} fill={svgProps.boardColor} pointerEvents={'all'}/>
        {svgBoardDecorations}
        {svgStones}
        {svgMoves}
        {svgHoverStones}
        {svgOwnership}
        {svgPolicy}
    </svg>;
}