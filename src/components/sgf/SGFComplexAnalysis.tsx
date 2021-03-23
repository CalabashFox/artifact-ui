import React, {Dispatch, SetStateAction, useMemo} from "react";
import {useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import SGFStackGraph from 'components/SGFStackGraph';

const useStyles = makeStyles((theme) => ({
    analysisDrawer: {
        padding: theme.spacing(2)
    },
}));

export interface SGFComplexAnalysisProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

const SGFComplexAnalysis: React.FC<SGFComplexAnalysisProps> = ({open, setOpen}) => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();

    const blackWinrateGraph = useMemo(() =>
        <SGFStackGraph 
            identifier={'winrate-stack-graph-black'} 
            data={sgfState.analyzedSGF.analysisData.blackWinrateAnalysis} 
            name={sgfState.analyzedSGF.playerBlack}/>
    , [sgfState.analyzedSGF.playerBlack, sgfState.analyzedSGF.analysisData]);

    const whiteWinrateGraph = useMemo(() => 
        <SGFStackGraph 
            identifier={'winrate-stack-graph-white'} 
            data={sgfState.analyzedSGF.analysisData.whiteWinrateAnalysis} 
            name={sgfState.analyzedSGF.playerWhite}/>
    , [sgfState.analyzedSGF.playerWhite, sgfState.analyzedSGF.analysisData]);

    return <React.Fragment key={'anchor'}>
        <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)} className={classes.analysisDrawer}>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    {blackWinrateGraph}
                </Grid> 
                <Grid item xs={6}>
                    {whiteWinrateGraph}
                </Grid>
            </Grid>
        </Drawer>
    </React.Fragment>;
}

export default SGFComplexAnalysis;