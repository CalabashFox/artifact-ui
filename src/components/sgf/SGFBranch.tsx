import React, { useCallback, useMemo, useRef } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import {makeStyles} from '@material-ui/core/styles';
import { SGFColor, SGFSnapshot, SGFStone } from 'models/SGF';
import { setMove } from 'actions/sgf';
import useSnapshots from 'components/hook/snapshots';

const useStyles = makeStyles(() => ({
    svg: {
        fontSize: 10,
        fontWeight: 100,
        fontFamily: 'Courier New, monospace',
        textAnchor: 'middle',
        '& text': {
            '-webkit-touch-callout': 'none',
            '-webkit-user-select': 'none',
            '-khtml-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none',
        },
        '&:hover': {
            cursor: 'pointer'
        }
    }
}));

const Dimensions = {
    RADIUS: 10,
    X_OFFSET: 30,
    Y_OFFSET: 30,
    LABEL_OFFSET: 3,
    STROKE_WIDTH: 2,
    HEIGHT: 40
};

enum Color {
    BLACK = '#000000',
    WHITE = '#fffff3'
}

const MAX_BRANCH_LEVEL = 10;

const calculateSVGLocation = (index: number, level: number): [number, number] => [Dimensions.X_OFFSET * index, Dimensions.Y_OFFSET * (level + 1)];

const getCurrentSGFColor = (stones: Array<SGFStone>): SGFColor => stones[stones.length - 1][0] === 'B' ? SGFColor.BLACK : SGFColor.WHITE;

const getColor = (sgfColor: SGFColor): Color => sgfColor === SGFColor.BLACK ? Color.BLACK : Color.WHITE;

const getOppositeColor = (sgfColor: SGFColor): Color => sgfColor === SGFColor.BLACK ? Color.WHITE : Color.BLACK;

interface BranchNode {
    adjustedLevel: number
    branchHead: boolean
    index: number
    moveIndex: number
    color: SGFColor
    label: string
    branchId: number
    level: number
}

const createSGFBranchMap = (snapshots: Array<SGFSnapshot>): BranchNode[][] => {
    const map: BranchNode[][] = new Array(MAX_BRANCH_LEVEL)
        .fill(null)
        .map(() => new Array(snapshots.length).fill(null));
    let previousBranch = -1;
    let previousAdjustedLevel = -1;
    for (let i = snapshots.length - 1; i > 0; i--) { 
        const snapshot = snapshots[i];
        let adjustedLevel = snapshot.level;
        // lift branch to upper row
        while (map[snapshot.level][snapshot.moveIndex] !== null) {
            adjustedLevel++;
        }
        // level adjusted
        if (adjustedLevel > snapshot.level) {
            previousAdjustedLevel = adjustedLevel;
        } 
        // set adjusted level for nodes in same branch
        if (previousBranch === snapshot.branchId) {
            // use adjusted level 
            if (previousAdjustedLevel !== -1) {
                adjustedLevel = previousAdjustedLevel;
            } else {
                previousAdjustedLevel = -1;
            }
        }
        map[adjustedLevel][snapshot.moveIndex] = {
            level: snapshot.level,
            index: snapshot.index,
            moveIndex: snapshot.moveIndex,
            color: getCurrentSGFColor(snapshot.stones),
            label: snapshot.stones[snapshot.stones.length - 1][1],
            adjustedLevel: adjustedLevel,
            branchId: snapshot.branchId,
            branchHead: snapshot.branchIndex === 0,
        };
        previousBranch = snapshot.branchId;
    }
    return map;
}

const SGFBranch: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const svgBranchElement = useRef<SVGSVGElement>(null);
    const dispatch = useDispatch();
    const snapshots = useSnapshots();

    const currentMove = sgfState.sgfProperties.currentMove;
    const nodeGraph = useMemo(() => createSGFBranchMap(snapshots), [snapshots]);
    const levels = useMemo(() => {
        let maxLevel = 0;
        for (let i = 0; i < MAX_BRANCH_LEVEL; i++) {
            maxLevel = Math.max(...nodeGraph[i].filter(node => node !== null).map(node => node.adjustedLevel + 1), maxLevel);
        }
        return maxLevel;
    }, [nodeGraph]);

    const svgElements = useMemo(() => {
        const array = new Array<React.SVGProps<SVGRectElement>>();
        for (let i = 0; i < MAX_BRANCH_LEVEL; i++) {
            const row = nodeGraph[i];
            for (let j = 0; j < row.length; j++) {
                const node = row[j];
                if (node === null) {
                    continue;
                }
                const circleColor = getColor(node.color);
                const labelColor = getOppositeColor(node.color);
                const [x, y] = calculateSVGLocation(node.moveIndex, node.adjustedLevel);
                if (j + 1 < row.length && nodeGraph[i][j + 1] !== null && (nodeGraph[i][j + 1].branchId === node.branchId || node.level === 0)) {
                    array.push(<line key={`line-br-${node.index}`} x1={x + Dimensions.RADIUS} x2={x + Dimensions.X_OFFSET - Dimensions.RADIUS} y1={y} y2={y} stroke={Color.BLACK}/>);
                }
                array.push(<circle key={`stone-br-${node.index}`} cx={x} cy={y} r={Dimensions.RADIUS} fill={circleColor}/>);
                array.push(<text key={`move-br-${node.index}`} x={x} y={y + Dimensions.LABEL_OFFSET} stroke={labelColor}>{node.label}</text>);
                if (node.branchHead && node.adjustedLevel !== 0) {
                    let root = null;
                    for (let r = i - 1; r >= 0 && j - 1 >= 0; r--) {
                        root = nodeGraph[r][j - 1];
                        if (root === null) {
                            continue;
                        }
                        if (root.moveIndex === node.moveIndex - 1) {
                            break;
                        }
                    }
                    if (root === null) {
                        continue;
                    }
                    const [rootX, rootY] = calculateSVGLocation(root.moveIndex, root.adjustedLevel);
                    const p1x = rootX + Dimensions.RADIUS * Math.cos(45);
                    const p1y = rootY + Dimensions.RADIUS * Math.sin(45);
                    const p2x = x - Dimensions.RADIUS;
                    const p2y = y;
        
                    // mid-point of line:
                    const mpx = (p2x + p1x) * 0.5;
                    const mpy = (p2y + p1y) * 0.5;
                    // angle of perpendicular to line:
                    const theta = Math.atan2(p2y - p1y, p2x - p1x) - Math.PI / 2;
                    // distance of control point from mid-point of line:
                    const offset = -10;
                    // location of control point:
                    const c1x = mpx + offset * Math.cos(theta);
                    const c1y = mpy + offset * Math.sin(theta);
        
                    // construct the command to draw a quadratic curve
                    const curve = `M${p1x} ${p1y} Q${c1x} ${c1y} ${p2x} ${p2y}`;
                    array.push(<path d={curve} stroke={Color.BLACK} strokeLinecap="round" fill="transparent"></path>);
                }
            }
        }
        return array;
    }, [nodeGraph]);

    const currentMoveElement = useMemo(() => {
        const array = new Array<React.SVGProps<SVGRectElement>>();
        if (currentMove === 0) {
            return array;
        }
        const node = nodeGraph.flatMap(row => row).find(node => node !== null && node.index === currentMove);
        if (node === undefined) {
            return array;
        }
        const circleColor = getColor(node.color);
        const labelColor = getOppositeColor(node.color);
        const [x, y] = calculateSVGLocation(node.moveIndex, node.adjustedLevel);

        array.push(<circle key={`stone-curr-br-${currentMove}`} cx={x} cy={y} r={Dimensions.RADIUS} strokeWidth={Dimensions.STROKE_WIDTH} stroke={labelColor} fill={circleColor}/>);
        array.push(<text key={`move-index-curr-br-${currentMove}`} x={x} y={y + Dimensions.LABEL_OFFSET} stroke={labelColor}>{node.label}</text>);
        return array;
    }, [nodeGraph, currentMove]);

    const width = useMemo(() => Dimensions.X_OFFSET * (snapshots.length + 1), [snapshots]);
    const height = useMemo(() => Dimensions.Y_OFFSET * (levels + 1), [levels]);
    const viewBox = useMemo(() => `0 0 ${width} ${height}`, [width, height]);

    const translateLocation = (x: number, y: number): [number, number] =>{
        return [Math.round(x / Dimensions.X_OFFSET), Math.round(y / Dimensions.Y_OFFSET) - 1];
    };

    const transformLocation = (event: React.MouseEvent<SVGSVGElement, MouseEvent>): [number, number] => {
        const svg = event.currentTarget;
        const pt = svg.createSVGPoint();
      
        pt.x = event.clientX;
        pt.y = event.clientY;
      
        const ctm = svg.getScreenCTM();
        if (ctm) {
            const cursorPt = pt.matrixTransform(ctm.inverse());
            return [cursorPt.x, cursorPt.y];
        } else {
            return [pt.x, pt.y]; 
        }
    }

    const handleClick = useCallback((event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const [x, y] = translateLocation(...transformLocation(event));
        if (y < 0 || y > levels - 1 || x < 0 || x > nodeGraph[0].length) {
            return;
        }
        const node = nodeGraph[y][x];
        if (node !== null) {
            dispatch(setMove(node.index));
        }
    }, [dispatch, nodeGraph, levels]);

    return <svg ref={svgBranchElement} viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className={classes.svg} 
        width={width} height={height}
        onClick={(e) => handleClick(e)}>
        <rect width={width} height={height} fill={'#deb887'} pointerEvents={'all'}/>
        {svgElements}
        {currentMoveElement}
    </svg>;
}   

export default SGFBranch;