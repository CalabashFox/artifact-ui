import React, {useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import {makeStyles} from '@material-ui/core/styles';
import SvgRenderer from 'utils/svgRenderer';
import { SGFColor, SGFSnapshot, SGFStone } from "models/SGF";
import { KatagoMoveInfo } from "models/Katago";
import useMoveColor from "./hook/moveColor";

const useStyles = makeStyles(() => ({
    svg: {
        fontSize: 12,
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

interface SGFBoardProps {
    click: (x: number, y: number) => void
    grids: number,
    snapshot: SGFSnapshot | null
    currentMove: number
    stones: Array<SGFStone>
    policy: Array<number>
    ownership: Array<number>
    moveInfos: Array<KatagoMoveInfo>
    hoverEffect: boolean
}

const SGFBoard: React.FC<SGFBoardProps> = ({click, grids, snapshot, stones, policy, ownership, moveInfos, hoverEffect, currentMove}) => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const sgfProperties = sgfState.sgfProperties;
    const dimension = 630;

    const moveColor = useMoveColor();

    const svgRenderer = useMemo(() => new SvgRenderer(dimension, grids, sgfProperties, classes), [dimension, grids, sgfProperties, classes]);

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
        // disable warning
        if (x === -1) {
            console.log(currentMove);
        }
        click(x, y);
    };

    const handleMouseOut = () => {
        if (!hoverEffect) {
            return;
        }
        setHoverStone({
            color: moveColor === SGFColor.BLACK ? 'B' : 'W',
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
            color: moveColor === SGFColor.BLACK ? 'B' : 'W',
            x: x,
            y: y
        });
    };

    const viewBox = `0 0 ${dimension} ${dimension}`;
    const svgBoardDecorations = svgRenderer.boardElements();
    const svgStones = svgRenderer.stoneElements(stones);
    const svgBranches = svgRenderer.branchElements(snapshot);
    const svgHoverStones = svgRenderer.hoverElement(hoverStone, hoverEffect);
    const svgMoves = svgRenderer.recommendationElements(moveInfos);
    const svgOwnership = svgRenderer.ownershipElements(ownership, moveColor);
    const svgPolicy = svgRenderer.policyElements(policy);

    return <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className={classes.svg}
        pointerEvents={'none'}
        onClick={(e) => handleClick(e)} 
        onMouseOut={() => handleMouseOut()}
        onMouseMove={(e) => handleMouseMove(e)}>
        {svgBoardDecorations}
        {svgStones}
        {svgBranches}
        {svgMoves}
        {svgHoverStones}
        {svgOwnership}
        {svgPolicy}
    </svg>;
}
export default SGFBoard;