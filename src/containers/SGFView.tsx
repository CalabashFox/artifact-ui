import React, {ReactElement, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GameState, SGFState, StoreState} from "models/StoreState";
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SGFBoard from './SGFBoard';
import {setMove} from 'actions/sgf';
import TextField from '@material-ui/core/TextField';
import SGFInformation from './SGFInformation';
import Drawer from '@material-ui/core/Drawer';
import SGFStackGraph from 'components/SGFStackGraph';
import {Left, DoubleLeft, ToLeft, Right, DoubleRight, ToRight, ChartHistogram, Analysis, Download} from '@icon-park/react'
import withWidth, {WithWidth} from '@material-ui/core/withWidth';
import useIcon from "components/icon";
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import SGFBoardSound from "components/SGFBoardSound";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(1),
        [theme.breakpoints.down('xs')]: {
            gridGap: 0
        }
    },
    boardContainer: {
        alignContent: 'baseline',
        order: 1
    },
    infoContainer: {
        order: 2,
        [theme.breakpoints.down('xs')]: {
            order: 0
        },
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.primary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        [theme.breakpoints.down('xs')]: {
            marginBottom: 0,
            borderRadius: 0
        }
    },
    disabled: {
        color: theme.palette.text.disabled
    },
    board: {
        marginBottom: 0
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
    boardActionPanel: {
    },
    inputField: {
        color: '#fff'
    },
    icon: {
        color: '#fff',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        '&:hover': {
            cursor: 'pointer'
        }
    },
    disabledIcon: {
        color: '#ccc',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        '&:hover': {
            cursor: 'not-allowed'
        }
    },
    analsysiDrawer: {
        padding: theme.spacing(2)
    },
    boardGrid: {
        marginBottom: theme.spacing(1)
    },
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
            color: '#fff',
            textAlign: 'center'
        },
        '& .MuiInput-underline:before' : {
            borderBottomColor: '#fff'
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottom: '2px solid #fff'
        },
        '& .MuiInput-underline:after': {
            display: 'none'
        }
    }
})(TextField);

function SGFView(props: WithWidth): ReactElement {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const gameState = useSelector<StoreState, GameState>(state => state.gameState);
    const classes = useStyles();
    const dispatch = useDispatch();

    const {width} = props;

    const totalMoves = sgfState.analyzedSGF.moves.length - 1;
    const currentMove = sgfState.sgfProperties.currentMove;

    const [moveText, setMoveText] = useState(currentMove);

    const [analysisDrawer, setAnalysisDrawer] = useState(false);

    const handleClick = (x: number, y: number) => {
        console.log(x, y);
    };

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

    const navigateBackward = (increment: number) => {
        if (currentMove === 0) {
            return;
        }
        const move = currentMove - increment;
        if (move >= 0) {
            dispatch(setMove(move));
        } else {
            dispatch(setMove(0));
        }
    };

    const navigateForward = (increment: number) => {
        if (currentMove === totalMoves) {
            return;
        }
        const move = currentMove + increment;
        if (move < totalMoves) {
            dispatch(setMove(move));
        } else {
            dispatch(setMove(totalMoves));
        }
    };
    const scroll = (event: React.WheelEvent) => {
        if (width === 'xs') {
            return;
        }
        const delta = event.deltaY;
        const steps = Math.abs(Math.floor(delta / 2));
        if (delta < 0) {
            navigateBackward(steps);
        } else {
            navigateForward(steps);
        }
    };

    if (sgfState.sgfProperties.useSound) {
        SGFBoardSound(gameState.actionState);
    }

    useEffect(() => {
        setMoveText(currentMove);
    }, [currentMove]);
    
    const backwardDisabled = currentMove === 0;
    const forwardDisabled = currentMove === totalMoves;

    const snapshot = sgfState.analyzedSGF.snapshotList[sgfState.sgfProperties.currentMove];

    const stones = sgfState.hasSGF ? snapshot.stones : [];
    const ownership = sgfState.hasSGF ? snapshot.katagoResults[0].ownership : [];
    const policy = sgfState.hasSGF ? snapshot.katagoResults[0].policy : [];
    const moveInfos = sgfState.hasSGF ? snapshot.katagoResults[0].moveInfos : [];

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
        <React.Fragment key={'anchor'}>
            <Drawer anchor="bottom" open={analysisDrawer} onClose={() => setAnalysisDrawer(false)} className={classes.analsysiDrawer}>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <SGFStackGraph identifier={'winrate-stack-graph-black'} data={sgfState.analyzedSGF?.analysisData.blackWinrateAnalysis ?? []} name={sgfState.analyzedSGF?.playerBlack ?? ''}/>
                    </Grid> 
                    <Grid item xs={6}>
                        <SGFStackGraph identifier={'winrate-stack-graph-white'} data={sgfState.analyzedSGF?.analysisData.whiteWinrateAnalysis ?? []} name={sgfState.analyzedSGF?.playerWhite ?? ''}/>
                    </Grid>
                </Grid>
            </Drawer>
        </React.Fragment>
        <Grid container spacing={1}>
            <Grid container item sm={7} xs={12} spacing={0} className={classes.boardContainer}>
                <Grid item xs={12} className={classes.boardGrid}>
                    <Paper className={`${classes.paper} ${classes.board}`} onWheel={(e) => scroll(e)}>
                        <SGFBoard click={(x, y) => handleClick(x, y)}
                            currentMove={currentMove}
                            policy={policy} 
                            moveInfos={moveInfos} 
                            stones={stones}
                            ownership={ownership}
                            hoverEffect={false}/>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={`${classes.paper} ${classes.boardActionPanel}`}>
                        <Grid container spacing={0}>
                            <Grid item sm={8} xs={12} spacing={0}>
                                {toStartIcon}
                                {fastBackwardIcon}
                                {backwardIcon}
                                <InputField label="move"
                                            value={moveText}
                                            size="small"
                                            className={classes.inputField}
                                            type="text"
                                            onChange={updateMoveText}
                                            InputLabelProps={{
                                                shrink: true
                                            }}/>
                                {forwardIcon}
                                {fastForwardIcon}
                                {toEndIcon}
                            </Grid>
                            <Grid item sm={4} xs={12} spacing={0} className={classes.graphButtons}>
                                <Hidden smUp>
                                    <Divider className={classes.divider}/>  
                                </Hidden>   
                                {chartIcon}
                                {analysisIcon}
                                {downloadIcon}
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item sm={5} xs={12} className={classes.infoContainer}>
                <SGFInformation/>
            </Grid>
        </Grid>
    </React.Fragment>;
    /*
    if (authState.isLoading) {
        return <Loading/>;
    } else if (auth === "unauthorized" && authorized) {
        return <Redirect to="/dashboard" />;
    } else if (auth === "authorized" && !authorized) {
        return <Redirect to="/" />;
    } else {
        return <Route {...props} />;
    }*/
}

export default withWidth()(SGFView);