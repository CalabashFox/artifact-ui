import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {setMove} from 'actions/sgf';
import TextField from '@material-ui/core/TextField';
import {Left, DoubleLeft, ToLeft, Right, DoubleRight, ToRight, ChartHistogram, Analysis, Download} from '@icon-park/react'
import useIcon from "components/hook/icon";
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import SGFComplexAnalysis from 'components/sgf/SGFComplexAnalysis';
import useNavigation from "components/hook/navigation";

const useStyles = makeStyles(() => ({
    graphButtons: {
        textAlign: 'right'
    }
}));

const InputField = withStyles({
    root: {
        '& label': {
            display: 'none'
        },
        '& label + .MuiInput-formControl': {
            marginTop: 0
        },
        '& .MuiInputBase-input': {
            width: 50,
            color: '#fffff3',
            textAlign: 'center'
        },
        '& .MuiInput-underline:before' : {
            borderBottomColor: '#fffff3'
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottom: '2px solid #fffff3'
        },
        '& .MuiInput-underline:after': {
            display: 'none'
        }
    }
})(TextField);

const SGFBoardPanel: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const dispatch = useDispatch();

    const totalMoves = sgfState.analyzedSGF.moves.length - 1;
    const currentMove = sgfState.sgfProperties.currentMove;
    
    const [analysisDrawer, setAnalysisDrawer] = useState(false);
    const [moveText, setMoveText] = useState(currentMove);
    const [navigateBackward, navigateForward] = useNavigation();

    const updateMoveText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const move = Number.parseInt(event.target.value);
        if (!isNaN(move) && move >= 0 && move < totalMoves) {
            setMoveText(moveText);
            dispatch(setMove(move));
        }
        if (isNaN(move)) {
            setMoveText(0);
            dispatch(setMove(0));
        }
    };

    const updateMove = (move: number) => {
        dispatch(setMove(move));
    }

    useEffect(() => {
        setMoveText(currentMove);
    }, [currentMove]);
    
    const snapshot = sgfState.analyzedSGF.snapshotList[sgfState.sgfProperties.currentMove];
    const hasKatagoResult = sgfState.hasSGF && snapshot.katagoResults.length > 0;

    const backwardDisabled = currentMove === 0 || !hasKatagoResult;
    const forwardDisabled = currentMove === totalMoves || !hasKatagoResult;
    
    const toStartIcon = useIcon(<ToLeft onClick={() => updateMove(0)}/>, backwardDisabled);
    const fastBackwardIcon = useIcon(<DoubleLeft onClick={() => navigateBackward(10)}/>, backwardDisabled);
    const backwardIcon = useIcon(<Left onClick={() => navigateBackward(1)}/>, backwardDisabled);

    const forwardIcon = useIcon(<Right onClick={() => navigateForward(1)}/>, forwardDisabled);
    const fastForwardIcon = useIcon(<DoubleRight onClick={() => navigateForward(10)}/>, forwardDisabled);
    const toEndIcon = useIcon(<ToRight onClick={() => updateMove(totalMoves)}/>, forwardDisabled);

    const chartIcon = useIcon(<ChartHistogram onClick={() => setAnalysisDrawer(true)}/>);
    const analysisIcon = useIcon(<Analysis onClick={() => setAnalysisDrawer(true)}/>);
    const downloadIcon = useIcon(<Download onClick={() => setAnalysisDrawer(true)}/>);

    return <React.Fragment>
        <SGFComplexAnalysis open={analysisDrawer} setOpen={setAnalysisDrawer}/>
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
                {chartIcon}
                {analysisIcon}
                {downloadIcon}
            </Grid>}
        </Grid>
    </React.Fragment>;
}

export default SGFBoardPanel;