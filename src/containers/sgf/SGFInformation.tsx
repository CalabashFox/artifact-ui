import React from 'react';
import {useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import SGFGraphTab from 'components/sgf/SGFGraphTab';
import SGFPlayers from 'components/sgf/SGFPlayers';
import SGFStatusBar from './SGFStatusBar';
import KatagoLog from 'components/KatagoLog';

const SGFInformation: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);

    return <React.Fragment>
        <Paper>
            <SGFStatusBar/>
            {sgfState.hasSGF && <Divider/>}
            {sgfState.hasSGF && <SGFPlayers/>}
        </Paper>
        <Paper>
            <SGFGraphTab/>
        </Paper>
        <Paper>
            <KatagoLog/>
        </Paper>
    </React.Fragment>;
}

export default SGFInformation;