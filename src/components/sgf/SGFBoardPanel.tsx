import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {setSGFProperties} from 'actions/sgf';
import TextField from '@material-ui/core/TextField';
import {Left, DoubleLeft, ToLeft, Right, DoubleRight, ToRight, BalanceTwo, ChartHistogram, Analysis, Download} from '@icon-park/react'
import useIcon from "components/hook/icon";
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import SGFComplexAnalysis from 'components/sgf/SGFComplexAnalysis';
import useNavigation from "components/hook/navigation";
import useCurrentSnapshot from "components/hook/currentSnapshot";

const useStyles = makeStyles(() => ({
    graphButtons: {
        textAlign: 'right'
    }
}));

const InputField = withStyles(theme => ({
    root: {
        '& label': {
            display: 'none'
        },
        '& label + .MuiInput-formControl': {
            marginTop: 0
        },
        '& .MuiInputBase-input': {
            width: 50,
            color: theme.palette.text.primary,
            textAlign: 'center'
        },
        '& .MuiInput-underline:before' : {
            borderBottomColor: theme.palette.text.primary
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            borderBottomColor: theme.palette.text.primary
        },
        '& .MuiInput-underline:after': {
            display: 'none'
        }
    }
}))(TextField);

const SGFBoardPanel: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const dispatch = useDispatch();
    const snapshot = useCurrentSnapshot();

    const moves = sgfState.navigation.col;
    
    const [analysisDrawer, setAnalysisDrawer] = useState(false);
    const [moveText, setMoveText] = useState(moves);
    const { rootIncremental, rootNavigation } = useNavigation();

    const updateMoveText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const move = Number.parseInt(event.target.value);
        const index = rootNavigation(move);
        setMoveText(index);
    };

    useEffect(() => {
        setMoveText(moves);
    }, [moves]);
    
    const hasKatagoResult = sgfState.hasSGF && snapshot !== null && snapshot.katagoResult !== null;

    const backwardDisabled = moves === 0;
    const forwardDisabled = moves >= sgfState.branchNavigation.rootCol;
    
    const toStartIcon = useIcon(<ToLeft onClick={() => rootNavigation(0)}/>, backwardDisabled);
    const fastBackwardIcon = useIcon(<DoubleLeft onClick={() => rootIncremental(-10)}/>, backwardDisabled);
    const backwardIcon = useIcon(<Left onClick={() => rootIncremental(-1)}/>, backwardDisabled);

    const forwardIcon = useIcon(<Right onClick={() => rootIncremental(1)}/>, forwardDisabled);
    const fastForwardIcon = useIcon(<DoubleRight onClick={() => rootIncremental(10)}/>, forwardDisabled);
    const toEndIcon = useIcon(<ToRight onClick={() => rootIncremental(sgfState.branchNavigation.col)}/>, forwardDisabled);

    const situationIcon = useIcon(<BalanceTwo onClick={() => dispatch(setSGFProperties({
        ...sgfState.sgfProperties, situationAnalysisMode: !sgfState.sgfProperties.situationAnalysisMode
    }))}/>);
    const chartIcon = useIcon(<ChartHistogram onClick={() => setAnalysisDrawer(true)}/>);
    const analysisIcon = useIcon(<Analysis onClick={() => setAnalysisDrawer(true)}/>);
    const downloadIcon = useIcon(<Download onClick={() => setAnalysisDrawer(true)}/>);

    return <React.Fragment>
        {hasKatagoResult && <SGFComplexAnalysis open={analysisDrawer} setOpen={setAnalysisDrawer}/>}
        <Grid container>
            <Grid item sm={8} xs={12}>
                {toStartIcon}
                {fastBackwardIcon}
                {backwardIcon}
                <InputField label="move"
                    value={moveText}
                    size="small"
                    type="text"
                    onChange={updateMoveText}
                    InputLabelProps={{
                        shrink: true
                    }}/>
                {forwardIcon}
                {fastForwardIcon}
                {toEndIcon}
            </Grid>
            {hasKatagoResult && <Grid item sm={4} xs={12} className={classes.graphButtons}>
                <Hidden smUp>
                    <Divider/>  
                </Hidden>   
                {situationIcon}
                {chartIcon}
                {analysisIcon}
                {downloadIcon}
            </Grid>}
        </Grid>
    </React.Fragment>;
}

export default SGFBoardPanel;