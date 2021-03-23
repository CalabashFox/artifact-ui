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

const SGFInformation: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const analysisCompleted = useMemo(() => {
        return sgfState.analyzedSGF.isValid && sgfState.analysisProgress.total !== 0 && sgfState.analysisProgress.analyzed === sgfState.analysisProgress.total;
    }, [sgfState.analyzedSGF.isValid, sgfState.analysisProgress.total, sgfState.analysisProgress.analyzed]);

    const displayAnalysisContent = sgfState.hasSGF && analysisCompleted;

    return <React.Fragment>
        <Paper>
            <SGFStatusBar/>
            {displayAnalysisContent && <Divider/>}
            {displayAnalysisContent && <SGFPlayers/>}
        </Paper>
        {displayAnalysisContent && <SGFBranchContainer/>}
        {displayAnalysisContent && <Paper>
            <SGFGraphTab/>
        </Paper>}
        <Paper>
            <KatagoLog/>
        </Paper>
    </React.Fragment>;
}

export default SGFInformation;