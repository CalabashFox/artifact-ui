import React, { useEffect, useRef } from 'react';
import {useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import SGFBranch from 'components/sgf/SGFBranch';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    container: {
        overflow: 'scroll'
    }
}));

const SGFBranchContainer: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();

    const svgElement = useRef<HTMLDivElement>(null);

    const middle = 200;

    const currentMove = sgfState.sgfProperties.currentMove;

    useEffect(() => {
        if (currentMove * 30 > middle) {
            svgElement.current?.scrollTo(currentMove * 30 - middle, 20);
        }
    }, [currentMove]);

    return <Paper className={classes.container} ref={svgElement}>
        <SGFBranch/>
    </Paper>;
}

export default SGFBranchContainer;