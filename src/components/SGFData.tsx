import React, {ReactElement} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'react-redux';
import { SGFState, StoreState } from 'models/StoreState';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) => ({
    info: {
        color: theme.palette.text.primary
    },
}));

const SGFData = (): ReactElement => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const gameInfo = sgfState.analyzedSGF;

    const headers = [];
    const info = [];

    if (gameInfo.event) {
        headers.push(<Typography noWrap>Event: </Typography>);
        info.push(<Typography noWrap>{gameInfo.event} (Round {gameInfo.round})</Typography>);
    }
    if (gameInfo.date) {
        headers.push(<Typography noWrap>Date: </Typography>);
        info.push(<Typography noWrap>{gameInfo.date}</Typography>);
    }

    if (gameInfo.rules) {
        headers.push(<Typography noWrap>Rule: </Typography>);
        info.push(<Typography noWrap>{gameInfo.rules}</Typography>);
    }

    if (gameInfo.timeLimit) {
        headers.push(<Typography noWrap>Time: </Typography>);
        info.push(<Typography noWrap>{gameInfo.timeLimit}</Typography>);
    }

    if (gameInfo.komi) {
        headers.push(<Typography noWrap>Komi: </Typography>);
        info.push(<Typography noWrap>{gameInfo.komi}</Typography>);
    }

    if (gameInfo.result) {
        headers.push(<Typography noWrap>Result: </Typography>);
        info.push(<Typography noWrap>{gameInfo.result}</Typography>);
    }

    return <Grid container spacing={1} className={classes.info}>
        <Grid item xs={3}>
            {headers}
        </Grid>
        <Grid item xs={9}>
            {info}
        </Grid>
    </Grid>;
}

export default SGFData;