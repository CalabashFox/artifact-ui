import React, {useState} from "react";
import {useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import {makeStyles} from '@material-ui/core/styles';
import SgfUtils from 'utils/sgfUtils';
import SvgRenderer from 'utils/svgRenderer';
import { SGFColor, SGFStone } from "models/SGF";
import { KatagoMoveInfo } from "models/Katago";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

const useStyles = makeStyles(() => ({
    svg: {
        fontSize: 10,
        fontWeight: 100,
        fontFamily: 'Courier New, monospace',
        textAnchor: 'middle'
    },
    stoneHolder: {
        '&:hover': {
            cursor: 'not-allowed'
        }
    }
}));

const BASE_DIM = 30;

const svgProps = {
    boardOffset: BASE_DIM / 2,
    dim: 630,
    boardColor: '#deb887',
    blockDim: BASE_DIM,
    blockOffset: BASE_DIM,
    blockColor: '#000',
    hoshiDim: 3,
    tengenDim: 5,
    blackColor: '#000',
    whiteColor: '#fffff3',
    stoneHolderDim: BASE_DIM,
    stoneHolderOffset: BASE_DIM * 0.5,
    stoneDim: BASE_DIM * 0.9 * 0.5, // radius
    stoneOffset: BASE_DIM * 0.45,
    currentStoneDim: BASE_DIM * 0.9 * 0.5 * 0.7,
    currentStoneWidth: 2,
    stoneTextOffset: 0,
    stoneTextOffsetY: 4,
    ownershipDim: BASE_DIM * 0.4,
    ownershipOffset: BASE_DIM * 0.2,
    textColor: '#000',
    winrateOffsetY: -4,
    leadOffsetY: 10,
    nextMoveOpacity: 0.75,
    moveBoarderColor: '#aaa',
    moveColor: '#FCDC05',
    bestMoveColor: '#0C6CD4',
    worstMoveColor: '#b71c1c'
}

interface SGFBoardProps {
    click: (x: number, y: number) => void
    currentMove: number
    stones: Array<SGFStone>
    policy: Array<number>
    ownership: Array<number>
    moveInfos: Array<KatagoMoveInfo>
    hoverEffect: boolean
}

const createHoverStone = (svgRenderer: SvgRenderer, occupiedCoordinates: SGFColor[][], stone: HoverStone, hoverEffect: boolean): Array<React.SVGProps<SVGRectElement>> => {
    const hoverStones = new Array<React.SVGProps<SVGRectElement>>();
    if (!hoverEffect || stone.x === -1 || stone.y === -1 || stone.x === 19 || stone.y === 19) {
        return hoverStones;
    }
    const i = stone.x;
    const j = stone.y;
    if (occupiedCoordinates[i][j] !== SGFColor.NONE) {
        return hoverStones;
    }
    const color = svgRenderer.color(stone.color);
    const [x, y] = svgRenderer.loc([i, j]);
    hoverStones.push(<circle key={`stone-hover`} cx={x} cy={y} r={svgProps.stoneDim} fill={color} fillOpacity={0.75}/>);
    
    return hoverStones;
}

const createSVGStones = (svgRenderer: SvgRenderer, occupiedCoordinates: SGFColor[][], stones: Array<SGFStone>, classes: ClassNameMap<string>): Array<React.SVGProps<SVGRectElement>> => {
    const svgStones = new Array<React.SVGProps<SVGRectElement>>();
    stones.forEach((stone, index) => {
        const [i, j] = SgfUtils.translateToCoordinate(stone[1]);
        const [x, y] = svgRenderer.loc([i, j]);
        const color = svgRenderer.color(stone[0]);
        const sgfColor = stone[0] === 'B' ? SGFColor.BLACK : SGFColor.WHITE;
        svgStones.push(<rect key={`stone-holder-${stone[1]}`} x={x - svgProps.stoneHolderOffset} y={y - svgProps.stoneHolderOffset} width={svgProps.stoneHolderDim} height={svgProps.stoneHolderDim} fill={svgProps.boardColor} className={classes.stoneHolder}/>);
        if (sgfColor === SGFColor.WHITE) {
            //stones.push(<circle key={`white-stone-boarder-${stone[1]}`} cx={x} cy={y} r={svgProps.stoneDim} strokeWidth={2} stroke={svgRenderer.oppositeColor(stone[0])} />);
        }
        svgStones.push(<circle key={`stone-${stone[1]}`} cx={x} cy={y} r={svgProps.stoneDim} fill={color}/>);
        if (svgRenderer.getSgfProperties().displayMoves && !svgRenderer.getSgfProperties().situationAnalysisMode) {
            svgStones.push(<text key={`snapshot-text-${index}`} x={x - svgProps.stoneTextOffset} y={y + svgProps.stoneTextOffsetY} stroke={svgRenderer.oppositeColor(stone[0])}>{index + 1}</text>);
        }     
        if (index === stones.length - 1 && !svgRenderer.getSgfProperties().situationAnalysisMode) {
            svgStones.push(<circle key={`current-stone-${stone[1]}`} cx={x} cy={y} r={svgProps.currentStoneDim} strokeWidth={svgProps.currentStoneWidth} stroke={svgRenderer.oppositeColor(stone[0])} fill={color}/>);
        }
        occupiedCoordinates[i][j] = sgfColor;
    });
    return svgStones;
}

const createSVGPoliy = (svgRenderer: SvgRenderer, occupiedCoordinates: SGFColor[][], policy: Array<number>): Array<React.SVGProps<SVGRectElement>> => {
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
        if (occupiedCoordinates[i][j] !== SGFColor.NONE) {
            return;
        }
        const opacity = value * 0.5;
        const [x, y] = svgRenderer.loc([i, j]);
        svgPolicy.push(<rect key={`policy-${index}`} x={x - svgProps.ownershipOffset} y={y - svgProps.ownershipOffset}
                            width={svgProps.ownershipDim} height={svgProps.ownershipDim} fill={'green'} fillOpacity={opacity}/>);
        occupiedCoordinates[i][j] = SGFColor.OCCUPIED;
    });
    return svgPolicy;
}

const createSVGOwnership = (svgRenderer: SvgRenderer, occupiedCoordinates: SGFColor[][], ownership: Array<number>, blackTurn: boolean, minimumOwnershipValue: number): Array<React.SVGProps<SVGRectElement>> => {
    const svgOwnership = new Array<React.SVGProps<SVGRectElement>>();
    if (!svgRenderer.getSgfProperties().displayOwnership)  {
        return svgOwnership;
    }
    ownership.forEach((value, index) => {
        let opacity = Math.abs(value);
        if (opacity < minimumOwnershipValue) {
            return;
        }
        opacity *= 0.5;
        const [i, j] = svgRenderer.dim(index);
        if (occupiedCoordinates[i][j] !== SGFColor.NONE && !svgRenderer.getSgfProperties().situationAnalysisMode) {
            return;
        }
        const [x, y] = svgRenderer.loc([i, j]);
        const sgfColor = svgRenderer.ownership(value, blackTurn);
        const color = svgRenderer.ownershipColor(sgfColor);

        // reverse color on captured stones
        if (occupiedCoordinates[i][j] !== SGFColor.NONE && svgRenderer.getSgfProperties().situationAnalysisMode) {
            // skip ownership if there are stone in same color
            if (occupiedCoordinates[i][j] === sgfColor) {
                return;
            } else if ((occupiedCoordinates[i][j] === SGFColor.BLACK || occupiedCoordinates[i][j] === SGFColor.WHITE) && occupiedCoordinates[i][j] !== sgfColor) {
                opacity *= 2;
            }
        }
        svgOwnership.push(<rect key={`ownership-${index}`} x={x - svgProps.ownershipOffset} y={y - svgProps.ownershipOffset}
                width={svgProps.ownershipDim} height={svgProps.ownershipDim} fillOpacity={opacity} fill={color}/>);

        occupiedCoordinates[i][j] = SGFColor.OCCUPIED;
    });
    return svgOwnership;
}

const createSVGMoves = (svgRenderer: SvgRenderer, occupiedCoordinates: SGFColor[][], moves: Array<KatagoMoveInfo>): Array<React.SVGProps<SVGRectElement>> => {
    const svgMoves = new Array<React.SVGProps<SVGRectElement>>();
    if (!svgRenderer.getSgfProperties().displayRecommendations) {
        return svgMoves;
    }
    for (let index = 0; index < moves.length; index++) {
        const move = moves[index];
        const [i, j] = SgfUtils.translateToCoordinate(move.move);
        const [x, y] = svgRenderer.loc([i, j]);
        const color = svgRenderer.moveColor(index, moves.length);
        svgMoves.push(<circle key={`move-${move.move}`} cx={x} cy={y} r={svgProps.stoneDim} fill={color} strokeWidth={1} fillOpacity={svgProps.nextMoveOpacity} stroke={svgProps.moveBoarderColor}/>);
        svgMoves.push(<text key={`move-winrate-${i}-${j}`} x={x} y={y + svgProps.winrateOffsetY} stroke={svgProps.textColor}>{(move.winrate * 100).toFixed(1)}</text>);
        svgMoves.push(<text key={`move-lead-${i}-${j}`} x={x} y={y + svgProps.leadOffsetY} stroke={svgProps.textColor}>{move.scoreLead.toFixed(1)}</text>);
        occupiedCoordinates[i][j] = SGFColor.OCCUPIED;
    }
    return svgMoves;
}

const createSVGBoard = (svgRenderer: SvgRenderer, occupiedCoordinates: SGFColor[][]): Array<React.SVGProps<SVGRectElement>> => {
    const svgLines = new Array<React.SVGProps<SVGRectElement>>();
    const svgDecorations = new Array<React.SVGProps<SVGRectElement>>();
    const dimension = svgRenderer.getBoardDimension();
    for (let i = 0; i < dimension; i++) {
        const length = dimension * svgProps.blockDim + svgProps.boardOffset;
        const offset = svgProps.boardOffset + i * svgProps.blockDim + svgProps.blockOffset;

        occupiedCoordinates[i] = [];
        // vertical
        svgLines.push(<line pointerEvents={'none'} key={`line-x-${i}`} x1={svgProps.boardOffset + svgProps.blockOffset} x2={length} y1={offset} y2={offset} stroke={svgProps.blockColor}/>);
        // 1-19
        const vc = dimension - i;
        svgLines.push(<text pointerEvents={'none'} key={`coord-x-${i}`} fontSize={14} x={svgProps.boardOffset + 5} y={offset + 4} stroke={svgProps.blockColor}>{vc}</text>);
        svgLines.push(<text pointerEvents={'none'} key={`coord-x-${i}`} fontSize={14} x={svgProps.dim - svgProps.boardOffset - 5} y={offset + 4} stroke={svgProps.blockColor}>{vc}</text>);
        // horizontal
        svgLines.push(<line pointerEvents={'none'} key={`line-y-${i}`} x1={offset} x2={offset} y1={svgProps.boardOffset + svgProps.blockOffset} y2={length} stroke={svgProps.blockColor}/>);
        // A-R
        const hc = String.fromCharCode(65 + (i >= 8 ? i + 1 : i));
        svgLines.push(<text pointerEvents={'none'} key={`coord-y-${i}`} fontSize={14} x={offset} y={svgProps.boardOffset + 10} stroke={svgProps.blockColor}>{hc}</text>);
        svgLines.push(<text pointerEvents={'none'} key={`coord-y-${i}`} fontSize={14} x={offset} y={svgProps.dim - svgProps.boardOffset - 5} stroke={svgProps.blockColor}>{hc}</text>);
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

const SGFBoard: React.FC<SGFBoardProps> = ({click, stones, policy, ownership, moveInfos, hoverEffect}) => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const sgfProperties = sgfState.sgfProperties;
    const dimension = 19;

    const blackTurn = stones.length === 0 || stones[stones.length - 1][0] === 'W';

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

    const occupiedCoordinates: SGFColor[][] = new Array(dimension)
        .fill(SGFColor.NONE)
        .map(() => new Array(dimension)
        .fill(SGFColor.NONE))
    const svgBoardDecorations = createSVGBoard(svgRenderer, occupiedCoordinates);
    const svgStones = createSVGStones(svgRenderer, occupiedCoordinates, stones, classes);
    const svgHoverStones = createHoverStone(svgRenderer, occupiedCoordinates, hoverStone, hoverEffect);
    const svgMoves = !sgfProperties.situationAnalysisMode ? createSVGMoves(svgRenderer, occupiedCoordinates, moveInfos) : [];
    const svgOwnership = sgfProperties.displayOwnership ? createSVGOwnership(svgRenderer, occupiedCoordinates, ownership, blackTurn, sgfProperties.minimumOwnershipValue) : [];
    const svgPolicy = sgfProperties.displayPolicy && !sgfProperties.situationAnalysisMode ? createSVGPoliy(svgRenderer, occupiedCoordinates, policy) : [];


    return <svg viewBox="0 0 630 630" preserveAspectRatio="xMidYMid meet" className={classes.svg}
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
export default SGFBoard;