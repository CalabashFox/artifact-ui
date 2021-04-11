import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'react-redux';
import { SGFState, StoreState } from 'models/StoreState';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next';

const SGFData: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const { t } = useTranslation();
    const gameInfo = sgfState.analyzedSGF;

    const headers = [];
    const info = [];

    if (gameInfo.event) {
        headers.push(<Typography noWrap>{t('go.event')}: </Typography>);
        info.push(<Typography noWrap>{gameInfo.event} ({t('go.round')} {gameInfo.round})</Typography>);
    }
    if (gameInfo.date) {
        headers.push(<Typography noWrap>{t('go.date')}: </Typography>);
        info.push(<Typography noWrap>{gameInfo.date}</Typography>);
    }

    if (gameInfo.rules) {
        headers.push(<Typography noWrap>{t('go.rule')}: </Typography>);
        info.push(<Typography noWrap>{gameInfo.rules}</Typography>);
    }

    if (gameInfo.timeLimit) {
        headers.push(<Typography noWrap>{t('go.time')}: </Typography>);
        info.push(<Typography noWrap>{gameInfo.timeLimit}</Typography>);
    }

    if (gameInfo.komi) {
        headers.push(<Typography noWrap>{t('go.komi')}: </Typography>);
        info.push(<Typography noWrap>{gameInfo.komi}</Typography>);
    }

    if (gameInfo.result) {
        headers.push(<Typography noWrap>{t('go.result')}: </Typography>);
        info.push(<Typography noWrap>{gameInfo.result}</Typography>);
    }

    return <Box width={300}>
        <Grid container spacing={1}>
            <Grid item xs={3}>
                {headers}
            </Grid>
            <Grid item xs={9}>
                {info}
            </Grid>
        </Grid>
    </Box>;
}

export default SGFData;