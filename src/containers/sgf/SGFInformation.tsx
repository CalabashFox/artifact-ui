import React, { useMemo } from 'react';
import {useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import SGFGraphTab from 'components/sgf/SGFGraphTab';
import SGFPlayers from 'components/sgf/SGFPlayers';
import SGFStatusBar from './SGFStatusBar';
import KatagoLog from 'components/KatagoLog';
import SGFBranchContainer from 'containers/SGFBranchContainer';
import SGFAnalysisTableContainer from 'containers/sgf/SGFAnalysisTableContainer';

const SGFInformation: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const analysisCompleted = useMemo(() => {
        return sgfState.analyzedSGF.isValid && sgfState.analysisProgress.total !== 0 && sgfState.analysisProgress.analyzed === sgfState.analysisProgress.total;
    }, [sgfState.analyzedSGF.isValid, sgfState.analysisProgress.total, sgfState.analysisProgress.analyzed]);

    const displayAnalysisContent = sgfState.hasSGF && analysisCompleted && sgfState.analyzedSGF.analyzedSnapshots !== 0;

    return <React.Fragment>
        <Paper>
            <SGFStatusBar/>
            {displayAnalysisContent && <Divider/>}
            {displayAnalysisContent && <SGFPlayers/>}
        </Paper>
            {sgfState.hasSGF && <SGFBranchContainer/>}
            {displayAnalysisContent && <Paper><SGFGraphTab/></Paper>}
        <Paper>
            <KatagoLog/>
        </Paper>
        {displayAnalysisContent && <Paper><SGFAnalysisTableContainer/></Paper>}
    </React.Fragment>;
}

export default SGFInformation;