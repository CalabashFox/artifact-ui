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
    RADIUS: 12,
    X_OFFSET: 32,
    Y_OFFSET: 32,
    LABEL_OFFSET: 3,
    STROKE_WIDTH: 2,
    HEIGHT: 40,
    LINE_WIDTH: 2
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
    adjustedLevel: number // adjusted level in graph
    branchHead: boolean // node is head of branch
    index: number // global unique index
    moveIndex: number // move number 
    color: SGFColor // stone color
    label: string // stone text
    branchId: number // id of branch
    level: number // original branch level
    rootBranchId: number // branch root id
    rootNode: BranchNode | undefined // root node reference
    previousNode: BranchNode | undefined // previous node reference
}

const createSGFBranchGraph = (snapshots: Array<SGFSnapshot>): {graph: BranchNode[][], levels: number, moves: number} => {
    const graph: BranchNode[][] = new Array(MAX_BRANCH_LEVEL)
        .fill(null)
        .map(() => new Array(snapshots.length).fill(null));
    const moveIndexMap = new Map<number, Array<SGFSnapshot>>();
    const branchRootMap = new Map<number, BranchNode>();
    const coordinateMap = new Map<string, BranchNode>();
    let levels = 0;
    let moves = 0;
    // ignore empty board
    for (let i = 1; i < snapshots.length; i++) { 
        const snapshot = snapshots[i];
        if (!moveIndexMap.has(snapshot.moveIndex)) {
            moveIndexMap.set(snapshot.moveIndex, new Array<SGFSnapshot>());
        }
        moveIndexMap.get(snapshot.moveIndex)?.push(snapshot);
    }
    const branchLevelMap = new Map<number, number>();
    for (let i = 0; i <= moveIndexMap.size; i++) {
        const snapshots = moveIndexMap.get(i) ?? new Array<SGFSnapshot>();
        snapshots.forEach(snapshot => {
            let adjustedLevel = branchLevelMap.get(snapshot.branchId) ?? snapshot.level;
            while (graph[adjustedLevel][snapshot.moveIndex] !== null) {
                adjustedLevel++;
            }
            branchLevelMap.set(snapshot.branchId, adjustedLevel);
            const node: BranchNode = {
                level: snapshot.level,
                index: snapshot.index,
                moveIndex: snapshot.moveIndex,
                color: getCurrentSGFColor(snapshot.stones),
                label: snapshot.stones[snapshot.stones.length - 1][1],
                adjustedLevel: adjustedLevel,
                branchId: snapshot.branchId,
                branchHead: snapshot.branchIndex === 0,
                rootBranchId: snapshot.rootBranchId,
                rootNode: undefined,
                previousNode: undefined
            };
            graph[adjustedLevel][snapshot.moveIndex] = node;
            if (snapshot.branches.length > 0) {
                branchRootMap.set(snapshot.branchId, node);
            }
            if (snapshot.branchIndex === 0) {
                node.rootNode = branchRootMap.get(snapshot.rootBranchId);
                node.previousNode = coordinateMap.get(`coord-${snapshot.rootBranchId}-${snapshot.moveIndex - 1}`);
            } else {
                node.previousNode = coordinateMap.get(`coord-${snapshot.branchId}-${snapshot.moveIndex - 1}`);
            }
            coordinateMap.set(`coord-${snapshot.branchId}-${snapshot.moveIndex}`, node);
            if (adjustedLevel > levels) {
                levels = adjustedLevel;
            }
            if (snapshot.moveIndex > moves) {
                moves = snapshot.moveIndex;
            }
        });
    }
    return {
        graph: graph,
        levels: levels + 1,
        moves: moves + 1
    };
}

const SGFBranch: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const svgBranchElement = useRef<SVGSVGElement>(null);
    const dispatch = useDispatch();
    const snapshots = useSnapshots();

    const currentMove = sgfState.sgfProperties.currentMove;
    const { graph, levels, moves } = useMemo(() => createSGFBranchGraph(snapshots), [snapshots]);

    const svgElements = useMemo(() => {
        const array = new Array<React.SVGProps<SVGRectElement>>();
        for (let i = 0; i < MAX_BRANCH_LEVEL; i++) {
            const row = graph[i];
            for (let j = 0; j < row.length; j++) {
                const node = row[j];
                if (node === null) {
                    continue;
                }
                const circleColor = getColor(node.color);
                const labelColor = getOppositeColor(node.color);
                const [x, y] = calculateSVGLocation(node.moveIndex, node.adjustedLevel);
                const prev = node.previousNode;
                if (prev !== undefined) {   
                    const [prevX, prevY] = calculateSVGLocation(prev.moveIndex, prev.adjustedLevel);
                    const newLevel = prev.adjustedLevel !== node.adjustedLevel;
                    const x1 = newLevel ? prevX + Dimensions.RADIUS * Math.cos(120) : prevX + Dimensions.RADIUS;
                    const y1 = newLevel ? prevY + Dimensions.RADIUS * Math.sin(120) : prevY;
                    const x2 = newLevel ? x - Dimensions.RADIUS * Math.cos(120) : x - Dimensions.RADIUS;
                    const y2 = newLevel ? y - Dimensions.RADIUS * Math.sin(120) : y;
                    array.push(<line key={`line-br-${node.index}`} x1={x1} x2={x2} y1={y1} y2={y2} strokeWidth={Dimensions.LINE_WIDTH} stroke={Color.BLACK}/>);
                }
                array.push(<circle key={`stone-br-${node.index}`} cx={x} cy={y} r={Dimensions.RADIUS} fill={circleColor}/>);
                array.push(<text key={`move-br-${node.index}`} x={x} y={y + Dimensions.LABEL_OFFSET} stroke={labelColor}>{node.label}</text>);    
            }
        }
        return array;
    }, [graph]);

    const currentMoveElement = useMemo(() => {
        const array = new Array<React.SVGProps<SVGRectElement>>();
        if (currentMove === 0) {
            return array;
        }
        const node = graph.flatMap(row => row).find(node => node !== null && node.index === currentMove);
        if (node === undefined) {
            return array;
        }
        const circleColor = getColor(node.color);
        const labelColor = getOppositeColor(node.color);
        const [x, y] = calculateSVGLocation(node.moveIndex, node.adjustedLevel);

        array.push(<circle key={`stone-curr-br-${currentMove}`} cx={x} cy={y} r={Dimensions.RADIUS} strokeWidth={Dimensions.STROKE_WIDTH} stroke={labelColor} fill={circleColor}/>);
        array.push(<text key={`move-index-curr-br-${currentMove}`} x={x} y={y + Dimensions.LABEL_OFFSET} stroke={labelColor}>{node.label}</text>);
        return array;
    }, [graph, currentMove]);

    const width = useMemo(() => Math.max(Dimensions.X_OFFSET * (moves + 1), 500), [moves]);
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
        if (y < 0 || y > levels - 1 || x < 0 || x > graph[0].length) {
            return;
        }
        const node = graph[y][x];
        if (node !== null) {
            dispatch(setMove(node.index));
        }
    }, [dispatch, graph, levels]);

    return <svg ref={svgBranchElement} viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className={classes.svg} 
        width={width} height={height}
        onClick={(e) => handleClick(e)}>
        <rect width={width} height={height} fill={'#deb887'} pointerEvents={'all'}/>
        {svgElements}
        {currentMoveElement}
    </svg>;
}   

export default SGFBranch;