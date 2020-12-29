import React, {ReactElement, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import * as mock from 'assets/sample.json'
import {AnalyzedSGF} from 'models/SGF';
import {makeStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SGFBoard from './SGFBoard';
import {ArrowBackIos, ArrowForwardIos} from '@material-ui/icons';
import {set} from 'actions/sgf';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
    },
    board: {
        padding: theme.spacing(3)
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
    boardActionPanel: {
    }
}));

export default function SGFView(): ReactElement {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const analyzedSGF = sgfState.analyzedSGF;
    const classes = useStyles();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(set(mock as unknown as AnalyzedSGF));
    }, []); // empty list = didMount
    //const authorized = !emptyValue(authState.auth);
    if (analyzedSGF === undefined) {
        return <div>1</div>;
    }
    return <div>
        <Grid container spacing={1}>
            <Grid container item xs={8}>
                <Grid item xs={12}>
                    <Paper className={`${classes.paper} ${classes.board}`}>
                        <SGFBoard/>
                    </Paper>
                </Grid>
                <Divider className={classes.divider} />
                <Grid item xs={12}>
                    <Paper className={`${classes.paper} ${classes.boardActionPanel}`}>
                        <ArrowBackIos fontSize="small" />
                        <ArrowForwardIos fontSize="small" />
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={4}>
                <Paper className={classes.paper}> black vs white </Paper>
            </Grid>
        </Grid>
    </div>;
    /*
    if (authState.isLoading) {
        return <Loading/>;
    } else if (auth === "unauthorized" && authorized) {
        return <Redirect to="/dashboard" />;
    } else if (auth === "authorized" && !authorized) {
        return <Redirect to="/" />;
    } else {
        return <Route {...props} />;
    }*/
}