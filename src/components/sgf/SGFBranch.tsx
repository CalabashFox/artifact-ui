import React, { useMemo, useRef } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import {makeStyles} from '@material-ui/core/styles';
import { SGFColor, SGFStone } from 'models/SGF';
import { setMove } from 'actions/sgf';

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
    Y_OFFSET: 20,
    LABEL_OFFSET: 3,
    STROKE_WIDTH: 2,
    HEIGHT: 40
};

enum Color {
    BLACK = '#000000',
    WHITE = '#fffff3'
}

const calculateSVGLocation = (index: number, level: number): [number, number] => [Dimensions.X_OFFSET * index, Dimensions.Y_OFFSET * (level + 1)];

const getCurrentSGFColor = (stones: Array<SGFStone>): SGFColor => stones[stones.length - 1][0] === 'B' ? SGFColor.BLACK : SGFColor.WHITE;

const getColor = (sgfColor: SGFColor): Color => sgfColor === SGFColor.BLACK ? Color.BLACK : Color.WHITE;

const getOppositeColor = (sgfColor: SGFColor): Color => sgfColor === SGFColor.BLACK ? Color.WHITE : Color.BLACK;

const SGFBranch: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const svgBranchElement = useRef<SVGSVGElement>(null);
    const dispatch = useDispatch();

    const currentMove = sgfState.sgfProperties.currentMove;
    const snapshots = sgfState.analyzedSGF.snapshotList;
    const levels = 1;

    const svgElements = useMemo(() => {
        const array = new Array<React.SVGProps<SVGRectElement>>();
        for (let index = 0; index < snapshots.length; index++) {
            if (index === 0) {
                continue;
            }
            const snapshot = snapshots[index];
            const sgfColor = getCurrentSGFColor(snapshot.stones);
            const circleColor = getColor(sgfColor);
            const labelColor = getOppositeColor(sgfColor);
            const [x, y] = calculateSVGLocation(index, 0);    

            array.push(<circle key={`stone-${index}`} cx={x} cy={y} r={Dimensions.RADIUS} fill={circleColor}/>);
            array.push(<line key={`line-${index}`} x1={x + Dimensions.RADIUS} x2={x + Dimensions.RADIUS + Dimensions.X_OFFSET} y1={y} y2={y} stroke={Color.BLACK}/>);
            array.push(<text key={`move-index-${index}`} x={x} y={y + Dimensions.LABEL_OFFSET} stroke={labelColor}>{index}</text>);
        }
        return array;
    }, [snapshots]);

    const currentMoveElement = useMemo(() => {
        const array = new Array<React.SVGProps<SVGRectElement>>();
        if (currentMove === 0) {
            return array;
        }
        const snapshot = snapshots[currentMove];
        const sgfColor = getCurrentSGFColor(snapshot.stones);
        const circleColor = getColor(sgfColor);
        const labelColor = getOppositeColor(sgfColor);
        const [x, y] = calculateSVGLocation(currentMove, 0);

        array.push(<circle key={`stone-current-${currentMove}`} cx={x} cy={y} r={Dimensions.RADIUS} strokeWidth={Dimensions.STROKE_WIDTH} stroke={labelColor} fill={circleColor}/>);
        array.push(<text key={`move-index-current-${currentMove}`} x={x} y={y + Dimensions.LABEL_OFFSET} stroke={labelColor}>{currentMove}</text>);
        return array;
    }, [snapshots, currentMove]);

    const width = useMemo(() => Dimensions.X_OFFSET * (snapshots.length + 1), [snapshots]);
    const height = useMemo(() => Dimensions.Y_OFFSET * (levels + 1), [levels]);
    const viewBox = useMemo(() => `0 0 ${width} ${height}`, [width, height]);

    const translateLocation = (x: number, y: number): [number, number] =>{
        return [Math.round(x / Dimensions.X_OFFSET), Math.round(y / Dimensions.Y_OFFSET)];
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

    const handleClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const [x, y] = translateLocation(...transformLocation(event));
        if (y > levels || x >= snapshots.length) {
            return;
        }
        dispatch(setMove(x));
    };

    return <svg ref={svgBranchElement} viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className={classes.svg} 
        width={width} height={height}
        onClick={(e) => handleClick(e)}>
        {svgElements}
        {currentMoveElement}
    </svg>;
}   

export default SGFBranch;