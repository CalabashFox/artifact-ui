import React, {ReactElement, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
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

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.primary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
        backgroundColor: theme.palette.primary.main
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
    leftContainer: {
        alignContent: 'baseline'
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

export default function SGFView(): ReactElement {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const dispatch = useDispatch();

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
        const delta = event.deltaY;
        const steps = Math.abs(Math.floor(delta / 2));
        if (delta < 0) {
            navigateBackward(steps);
        } else {
            navigateForward(steps);
        }
    };

    useEffect(() => {
        setMoveText(currentMove);
    }, [currentMove]);

    const iconFill = '#fff';
    const disabledIconFill = '#ccc';
    
    const navBack = currentMove !== 0;
    const navForward = currentMove !== totalMoves;

    const navBackFill = navBack ? iconFill : disabledIconFill;
    const navForwardFill = navForward ? iconFill : disabledIconFill;

    const navBackStyle = navBack ? classes.icon : classes.disabledIcon;
    const navForwardStyle = navForward ? classes.icon : classes.disabledIcon;

    const snapshot = sgfState.analyzedSGF.snapshotList[sgfState.sgfProperties.currentMove];
    const stones = snapshot.stones;
    const ownership = snapshot.katagoResults[0].ownership;
    const policy = snapshot.katagoResults[0].policy;
    const moveInfos = snapshot.katagoResults[0].moveInfos;
    
    return <div>
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
            <Grid container item xs={7} spacing={0} className={classes.leftContainer}>
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
                            <Grid item xs={8} spacing={0}>
                                <ToLeft theme="outline" size="24" fill={navBackFill} className={navBackStyle} onClick={() => updateMove(0)} />
                                <DoubleLeft theme="outline" size="24" fill={navBackFill} className={navBackStyle} onClick={() => navigateBackward(10)} />
                                <Left theme="outline" size="24" fill={navBackFill} className={navBackStyle} onClick={() => navigateBackward(1)} />
                                <InputField label="move"
                                            value={moveText}
                                            size="small"
                                            className={classes.inputField}
                                            type="text"
                                            onChange={updateMoveText}
                                            InputLabelProps={{
                                                shrink: true
                                            }}/>
                                <Right theme="outline" size="24" fill={navForwardFill} className={navForwardStyle} onClick={() => navigateForward(1)} />
                                <DoubleRight theme="outline" size="24" fill={navForwardFill} className={navForwardStyle} onClick={() => navigateForward(10)} />
                                <ToRight theme="outline" size="24" fill={navForwardFill} className={navForwardStyle} onClick={() => updateMove(totalMoves)} />
                            </Grid>
                            <Grid item xs={4} spacing={0} className={classes.graphButtons}>
                                <ChartHistogram theme="outline" size="24" fill={iconFill} className={classes.icon}/>
                                <Analysis theme="outline" size="24" fill={iconFill} className={classes.icon} onClick={() => setAnalysisDrawer(true)}/>
                                <Download theme="outline" size="24" fill={iconFill} className={classes.icon}/>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={5}>
                <SGFInformation/>
            </Grid>
        </Grid>
    </div>;
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