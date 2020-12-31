import React, {useCallback, useEffect} from 'react';
import SGFView from './SGFView';
import {useDispatch, useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import {makeStyles} from '@material-ui/core/styles';
import {AnalyzedSGF} from 'models/SGF';
import * as mock from 'assets/sample.json'
import {set} from 'actions/sgf';

const useStyles = makeStyles((theme) => ({
    dashboard: {
        padding: theme.spacing(1),
        boxSizing: 'border-box'
    }
}));

const Dashboard: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const dispatch = useDispatch();

    const initFetch = useCallback(() => {
        dispatch(set(mock as unknown as AnalyzedSGF));
    }, [dispatch]);

    useEffect(() => {
        initFetch();
    }, [initFetch]);

    if (sgfState.analyzedSGF === undefined) {
        return <div>1</div>
    }
    return <div className={classes.dashboard}>
        <SGFView/>
    </div>;
};

export default Dashboard;