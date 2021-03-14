import React from 'react';
import {useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import SGFGraphTab from "components/SGFGraphTab";
import SGFPlayers from 'components/SGFPlayers';
import SGFStatusBar from 'components/SGFStatusBar';

const SGFInformation: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);

    return <React.Fragment>
        <Paper>
            <Grid container spacing={1}>
                <SGFStatusBar/>
            </Grid>
            <Divider/>
            <Grid container spacing={1}>
                {sgfState.hasSGF && <SGFPlayers/>}
            </Grid>
        </Paper>
        <Paper>
            <SGFGraphTab/>
        </Paper>
    </React.Fragment>;
}

export default SGFInformation;