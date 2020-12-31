import React, {ReactElement} from "react";
import {useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import {makeStyles} from '@material-ui/core/styles';
import SgfUtils from 'utils/sgfUtils';
import SvgRenderer from 'utils/svgRenderer';

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
        fontFamily: 'Lucida Grande,Tahoma,Verdana,Arial,sans-serif',
        textAnchor: 'middle'
    }
}));

const BASE_DIM = 30

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
    stoneTextOffset: 0,
    stoneTextOffsetY: 4,
    ownershipDim: BASE_DIM * 0.5,
    ownershipOffset: BASE_DIM * 0.25,
}

export default function SGFBoard(): ReactElement {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const analyzedSGF = sgfState.analyzedSGF;
    const sgfProperties = sgfState.sgfProperties;
    const dimension = 19;
    const currentMove = sgfState.sgfProperties.currentMove;

    const svgRenderer = new SvgRenderer(dimension, svgProps);

    if (analyzedSGF !== undefined) {
        const usedCoordinate: boolean[][] = [];
        const lines = new Array<React.SVGProps<SVGRectElement>>();
        const decorations = new Array<React.SVGProps<SVGRectElement>>();
        for (let i = 0; i < dimension; i++) {
            const length = dimension * svgProps.blockDim;
            const offset = i * svgProps.blockDim + svgProps.blockOffset;

            usedCoordinate[i] = [];
            // vertical
            lines.push(<line key={`line-x-${i}`} x1={svgProps.blockOffset} x2={length} y1={offset} y2={offset} stroke={svgProps.blockColor}/>);
            // horizontal
            lines.push(<line key={`line-y-${i}`} x1={offset} x2={offset} y1={svgProps.blockOffset} y2={length} stroke={svgProps.blockColor}/>);
            for (let j = 0; j < dimension; j++) {
                const [x, y] = svgRenderer.loc([i, j]);
                if (SgfUtils.isHoshi([i, j])) {
                    decorations.push(<circle key={`hoshi-${i}-${j}`} cx={x} cy={y} r={svgProps.hoshiDim} stroke={svgProps.blockColor}/>);
                }
                if (SgfUtils.isTengen([i, j])) {
                    decorations.push(<circle key={`tengen`} cx={x} cy={y} r={svgProps.tengenDim} stroke={svgProps.blockColor}/>);
                }
            }
        }
        const stones = new Array<React.SVGProps<SVGRectElement>>();
        const snapshot = analyzedSGF.snapshotList[sgfState.sgfProperties.currentMove];
        //const currentStone = snapshot.stones[snapshot.stones.length - 1];
        snapshot.stones.forEach((stone, index) => {
            const [i, j] = SgfUtils.translateToCoordinate(stone[1]);
            const [x, y] = svgRenderer.loc([i, j]);
            const color = svgRenderer.color(stone[0]);
            stones.push(<rect key={`stone-holder-${stone[1]}`} x={x - svgProps.stoneHolderOffset} y={y - svgProps.stoneHolderOffset} width={svgProps.stoneHolderDim} height={svgProps.stoneHolderDim} fill={svgProps.boardColor}/>);
            stones.push(<circle key={`stone-${stone[1]}`} cx={x} cy={y} r={svgProps.stoneDim} fill={color}/>);
            const displayMoves = !sgfProperties.displayMoves || index === sgfProperties.currentMove;
            if (displayMoves) {
                const moveColor = stone[0] === 'B' ? svgProps.whiteColor : svgProps.blackColor;
                stones.push(<text key={`snapshot-text-${index}`} x={x - svgProps.stoneTextOffset} y={y + svgProps.stoneTextOffsetY} className={classes.font} stroke={moveColor}>{index + 1}</text>);
            }

            usedCoordinate[i][j] = true;
        });
        const analysis = new Array<React.SVGProps<SVGRectElement>>();
        if (sgfProperties.displayOwnership && snapshot.katagoResults.length !== 0) {
            const result = snapshot.katagoResults[0];
            result.ownership.forEach((ownership, index) => {
                const opacity = Math.abs(ownership);
                if (opacity < 0.1) { // TODO make this as settings
                    return;
                }
                const [i, j] = svgRenderer.dim(index);
                if (usedCoordinate[i][j]) {
                    return;
                }
                const [x, y] = svgRenderer.loc([i, j]);
                const color = svgRenderer.ownershipColor(ownership);
                analysis.push(<rect key={`ownership-${currentMove}-${index}`} x={x - svgProps.ownershipOffset} y={y - svgProps.ownershipOffset}
                                    width={svgProps.ownershipDim} height={svgProps.ownershipDim} fillOpacity={opacity} fill={color}/>);
            });
            result.moveInfos.forEach((moveInfo, index) => {
                console.log(moveInfo, index);
            });
            result.policy.forEach((policy, index) => {
                if (index === 19 * 19) {
                    return;
                }
                if (policy === -1) {
                    return;
                }
                const p = policy * 100;
                const minimumPolicy = 10; // TODO settings
                if (p <= minimumPolicy) {
                    return;
                }
                const [i, j] = svgRenderer.dim(index);
                const [x, y] = svgRenderer.loc([i, j]);
                analysis.push(<rect key={`policy-${currentMove}-${index}`} x={x - svgProps.ownershipOffset} y={y - svgProps.ownershipOffset}
                                    width={svgProps.ownershipDim} height={svgProps.ownershipDim} fill={'green'}/>);
            });
        }

        return <svg width={svgProps.dim} height={svgProps.dim}>
            <rect width={svgProps.dim} height={svgProps.dim} fill={svgProps.boardColor} />
            {lines}
            {decorations}
            {stones}
            {analysis}
        </svg>;
    }
    return <svg width={svgProps.dim} height={svgProps.dim}>
        <rect width={svgProps.dim} height={svgProps.dim} fill={svgProps.boardColor} />
    </svg>;

}