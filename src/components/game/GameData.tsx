import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'react-redux';
import { SGFState, StoreState } from 'models/StoreState';
import Typography from '@material-ui/core/Typography';

const GameData: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const gameInfo = sgfState.analyzedSGF;

    const headers = [];
    const info = [];

    if (gameInfo.event) {
        headers.push(<Typography key={'label-event'} noWrap>Event: </Typography>);
        info.push(<Typography key={'label-event'} noWrap>{gameInfo.event} (Round {gameInfo.round})</Typography>);
    }
    if (gameInfo.date) {
        headers.push(<Typography key={'label-date'} noWrap>Date: </Typography>);
        info.push(<Typography key={'value-date'} noWrap>{gameInfo.date}</Typography>);
    }

    if (gameInfo.rules) {
        headers.push(<Typography key={'label-rule'} noWrap>Rule: </Typography>);
        info.push(<Typography key={'value-rule'} noWrap>{gameInfo.rules}</Typography>);
    }

    if (gameInfo.timeLimit) {
        headers.push(<Typography key={'label-time'} noWrap>Time: </Typography>);
        info.push(<Typography key={'value-time'} noWrap>{gameInfo.timeLimit}</Typography>);
    }

    if (gameInfo.komi) {
        headers.push(<Typography key={'label-komi'} noWrap>Komi: </Typography>);
        info.push(<Typography key={'value-komi'} noWrap>{gameInfo.komi}</Typography>);
    }

    if (gameInfo.result) {
        headers.push(<Typography key={'label-result'} noWrap>Result: </Typography>);
        info.push(<Typography key={'value-result'} noWrap>{gameInfo.result}</Typography>);
    }

    return <Grid container spacing={1}>
        <Grid item xs={3}>
            {headers}
        </Grid>
        <Grid item xs={9}>
            {info}
        </Grid>
    </Grid>;
}

export default GameData;