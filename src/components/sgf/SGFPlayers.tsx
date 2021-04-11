import React from 'react';
import {useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import SGFPlayer from './SGFPlayer';
import WinrateStatus from './WinrateStatus';
import { SGFColor } from 'models/SGF';
import SGFTerritoryInfo from './SGFTerritoryInfo';
import usePlayerTitle from "components/hook/playerTitle";

const SGFPlayers: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const [playerBlack, playerWhite, rankBlack, rankWhite] = usePlayerTitle();
    const analyzedSGF = sgfState.analyzedSGF;

    const index = sgfState.sgfProperties.currentMove;
    const blackTurn = index % 2 === 0;
    const winrateList = !analyzedSGF.useAnalysis ? [] : (blackTurn ? analyzedSGF.analysisData.blackWinrate : analyzedSGF.analysisData.whiteWinrate);
    const winrate = !analyzedSGF.useAnalysis ? 0 : winrateList[index].value ?? 0;
    const blackWinrate = blackTurn ? winrate : 100 - winrate;
    const whiteWinrate = 100 - blackWinrate;

    const showDiff = index >= 1 && analyzedSGF.useAnalysis;

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
        <Box pb={1}>
            <Grid container>
                <Grid item xs={6}>
                    <SGFPlayer 
                        color={SGFColor.BLACK}
                        name={playerBlack}
                        rank={rankBlack}
                        turn={blackTurn}/>
                </Grid>
                <Grid item xs={6}>
                    <SGFPlayer 
                        color={SGFColor.WHITE}
                        name={playerWhite}
                        rank={rankWhite}
                        turn={!blackTurn}/>
                </Grid>
            </Grid>
        </Box>
        <Box width={1}>
            <WinrateStatus color={SGFColor.BLACK} winrate={blackWinrate} winrateDiff={blackWinrateDiff}/>
            <WinrateStatus color={SGFColor.WHITE} winrate={whiteWinrate} winrateDiff={whiteWinrateDiff}/>
        </Box>
        {sgfState.sgfProperties.situationAnalysisMode && <Box width={1} pt={0.5} pb={0.5}>
            <SGFTerritoryInfo/>
        </Box>}
    </React.Fragment>;
}

export default SGFPlayers;