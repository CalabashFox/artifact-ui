import React from 'react';
import {useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import SGFPlayer from './SGFPlayer';
import WinrateStatus from './WinrateStatus';
import { SGFColor } from 'models/SGF';

const useStyles = makeStyles((theme) => ({
    playerContainer: {
        paddingBottom: theme.spacing(1)
    }
}));

const SGFPlayers: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();

    const index = sgfState.sgfProperties.currentMove;
    const blackTurn = index % 2 === 0;
    const winrateList = blackTurn ? sgfState.analyzedSGF.analysisData.blackWinrate : sgfState.analyzedSGF.analysisData.whiteWinrate;
    const winrate = winrateList[index].value ?? 0;
    const blackWinrate = blackTurn ? winrate : 100 - winrate;
    const whiteWinrate = 100 - blackWinrate;

    const showDiff = index >= 1;

    let previousWinrate = 0;
    let blackWinrateDiff = 0;
    let whiteWinrateDiff = 0;
    if (showDiff) {
        const previousWinrateList = blackTurn ? sgfState.analyzedSGF.analysisData.whiteWinrate : sgfState.analyzedSGF.analysisData.blackWinrate;
        const prevWinrate = previousWinrateList[index - 1].value ?? 0;
        previousWinrate = blackTurn ? prevWinrate : 100 - prevWinrate;
        whiteWinrateDiff = whiteWinrate - previousWinrate;
        blackWinrateDiff = -whiteWinrateDiff;
    }

    return <React.Fragment>
        <Grid container className={classes.playerContainer}>
            <Grid item xs={6}>
                <SGFPlayer 
                    color={SGFColor.BLACK}
                    name={sgfState.analyzedSGF.playerBlack}
                    rank={sgfState.analyzedSGF.rankBlack}
                    turn={blackTurn}/>
            </Grid>
            <Grid item xs={6}>
                <SGFPlayer 
                    color={SGFColor.WHITE}
                    name={sgfState.analyzedSGF.playerWhite}
                    rank={sgfState.analyzedSGF.rankWhite}
                    turn={!blackTurn}/>
            </Grid>
        </Grid>
        <Box width={1}>
            <WinrateStatus color={SGFColor.BLACK} winrate={blackWinrate} winrateDiff={blackWinrateDiff}/>
            <WinrateStatus color={SGFColor.WHITE} winrate={whiteWinrate} winrateDiff={whiteWinrateDiff}/>
        </Box>
    </React.Fragment>;
}

export default SGFPlayers;