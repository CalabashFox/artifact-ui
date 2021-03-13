import React, {ReactElement} from 'react';
import {useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import blackIcon from 'assets/images/black.svg';
import blackTurnIcon from 'assets/images/black-turn.svg';
import whiteIcon from 'assets/images/white.svg';
import whiteTurnIcon from 'assets/images/white-turn.svg';

const useStyles = makeStyles((theme: Theme) => ({
    whitePlayer: {
        color: '#fff'
    },
    blackPlayer: {
        color: '#0'
    },
    playerTitle: {
        fontSize: 20,
        display: 'inline-block',
        verticalAlign: 'middle',
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    },
    statusContainer: {
        width: '100%'
    },
    status: {
        height: 20,
        display: 'inline-block',
        textAlign: 'center'
    },
    blackStatus: {
        backgroundColor: '#000',
        color: '#fff'
    },
    whiteStatus: {
        backgroundColor: '#fff',
        color: '#000'
    },
}));

const SGFPlayers = (): ReactElement => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();

    const index = sgfState.sgfProperties.currentMove;
    const useBlackData = index % 2 === 0;
    const winrateList = useBlackData ? sgfState.analyzedSGF.analysisData.blackWinrate : sgfState.analyzedSGF.analysisData.whiteWinrate;
    const winrate = winrateList[index].value ?? 0;
    const blackWinrate = useBlackData ? winrate : 100 - winrate;
    const whiteWinrate = 100 - blackWinrate;

    const showDiff = index >= 1;

    let previousWinrate = 0;
    let blackWinrateDiff = 0;
    let whiteWinrateDiff = 0;
    if (showDiff) {
        const previousWinrateList = useBlackData ? sgfState.analyzedSGF.analysisData.whiteWinrate : sgfState.analyzedSGF.analysisData.blackWinrate;
        const prevWinrate = previousWinrateList[index - 1].value ?? 0;
        previousWinrate = useBlackData ? prevWinrate : 100 - prevWinrate;
        whiteWinrateDiff = whiteWinrate - previousWinrate;
        blackWinrateDiff = -whiteWinrateDiff;
    }

    return <React.Fragment>
        <Grid container spacing={1}>
            <Grid item xs={6} className={classes.blackPlayer}>
                <img src={useBlackData ? blackTurnIcon : blackIcon} className={classes.playerTitle} alt="black"/>
                <Typography className={classes.playerTitle} noWrap>
                    {sgfState.analyzedSGF.playerBlack}({sgfState.analyzedSGF.rankBlack})
                </Typography>
            </Grid>
            <Grid item xs={6} className={classes.whitePlayer}>
                <img src={useBlackData ? whiteIcon : whiteTurnIcon} className={classes.playerTitle} alt="white"/>
                <Typography className={classes.playerTitle} noWrap>
                    {sgfState.analyzedSGF.playerWhite}({sgfState.analyzedSGF.rankWhite})
                </Typography>
            </Grid>
        </Grid>
        <Grid container spacing={1}>
            <Grid item xs={6} className={classes.blackPlayer}>
                <Typography className={classes.playerTitle} noWrap>

                </Typography>
            </Grid>
        </Grid>
        <Box className={classes.statusContainer}>
            <Box className={[classes.blackStatus, classes.status].join(' ')} style={{width: blackWinrate + '%', minWidth: '10%'}}>
                {blackWinrate.toFixed(1) + '%'} {showDiff && blackWinrateDiff > 0 ? '(+' + blackWinrateDiff.toFixed(1) + '%)' : ''}
            </Box>
            <Box className={[classes.whiteStatus, classes.status].join(' ')} style={{width: whiteWinrate + '%', minWidth: '10%'}}>
                {whiteWinrate.toFixed(1) + '%'} {showDiff && whiteWinrateDiff > 0 ? '(+' + whiteWinrateDiff.toFixed(1) + '%)' : ''}
            </Box>
        </Box>
    </React.Fragment>;
}

export default SGFPlayers;