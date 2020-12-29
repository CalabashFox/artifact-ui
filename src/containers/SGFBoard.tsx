import React, {ReactElement, useState} from "react";
import {useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import {AnalyzedSGF} from 'models/SGF';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import SGFUtils from 'utils/sgfUtils';

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
}

export default function SGFBoard(): ReactElement {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const analyzedSGF = sgfState.analyzedSGF;
    const dimension = 19;

    if (analyzedSGF !== undefined) {
        const lines = new Array<any>();
        const decorations = new Array<any>();
        for (let i = 0; i < dimension; i++) {
            const length = dimension * svgProps.blockDim;
            const offset = i * svgProps.blockDim + svgProps.blockOffset;
            // vertical
            lines.push(<line key={`line-x-${i}`} x1={svgProps.blockOffset} x2={length} y1={offset} y2={offset} stroke={svgProps.blockColor}/>);
            // horizontal
            lines.push(<line key={`line-y-${i}`} x1={offset} x2={offset} y1={svgProps.blockOffset} y2={length} stroke={svgProps.blockColor}/>);
            for (let j = 0; j < dimension; j++) {
                const x = svgProps.blockDim * j + svgProps.blockOffset;
                const y = svgProps.blockDim * i + svgProps.blockOffset;
                if (SGFUtils.isHoshi([i, j])) {
                    decorations.push(<circle key={`hoshi-${i}-${j}`} cx={x} cy={y} r={svgProps.hoshiDim} stroke={svgProps.blockColor}/>);
                }
                if (SGFUtils.isTengen([i, j])) {
                    decorations.push(<circle key={`tengen`} cx={x} cy={y} r={svgProps.tengenDim} stroke={svgProps.blockColor}/>);
                }
            }
        }
        const stones = new Array<any>();
        const snapshot = analyzedSGF.snapshotList[sgfState.sgfProperties.currentMove];
        snapshot.stones.forEach((stone, index) => {
            const dim = SGFUtils.translateToCoordinate(stone[1]);
            const [i, j] = dim;
            const color = stone[0] === 'W' ? svgProps.whiteColor : svgProps.blackColor;
            const x = svgProps.blockDim * j + svgProps.blockOffset;
            const y = svgProps.blockDim * i + svgProps.blockOffset;
            decorations.push(<rect key={`stone-holder-${i}-${j}`} x={x - svgProps.stoneHolderOffset} y={y - svgProps.stoneHolderOffset} width={svgProps.stoneHolderDim} height={svgProps.stoneHolderDim} fill={svgProps.boardColor}/>);
            decorations.push(<circle key={`stone-${i}-${j}`} cx={x} cy={y} r={svgProps.stoneDim} fill={color}/>);
        });

        return <svg width={svgProps.dim} height={svgProps.dim}>
            <rect width={svgProps.dim} height={svgProps.dim} fill={svgProps.boardColor} />
            {lines}
            {decorations}
            {stones}
        </svg>;
    }
    return <svg width={svgProps.dim} height={svgProps.dim}>
        <rect width={svgProps.dim} height={svgProps.dim} fill={svgProps.boardColor} />
    </svg>;

}