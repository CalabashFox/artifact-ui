import React, {ReactElement,useCallback,useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GameState, StoreState} from "models/StoreState";
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SGFBoard from './SGFBoard';
import {Undo, CloseOne, RightOne, ChartHistogram, Analysis} from '@icon-park/react'
import { placeStone, startGame, stopGame, undo } from "actions/game";
import SocketHandler from "utils/socketHandler";
import GameInformation from "./GameInformation";
import * as placeStoneSound from 'assets/audio/placestone.mp3';
import * as invalidMoveSound from 'assets/audio/invalidmove.mp3';
import * as removeStoneSound from 'assets/audio/removestone.mp3';
import { GameActionState } from "models/Game";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
        backgroundColor: theme.palette.primary.light
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

export default function GameView(): ReactElement {
    const gameState = useSelector<StoreState, GameState>(state => state.gameState);
    const actionState = gameState.actionState;
    const classes = useStyles();
    const dispatch = useDispatch();
    const game = gameState.game;
    
    const stones = game.stones;
    const currentMove = game.currentMove;
    const {policy, ownership, moveInfos} = gameState.currentResult;

    const [socket] = useState(new SocketHandler());
    const [placeStoneAudio] = useState(new Audio(placeStoneSound.default));
    const [invalidActionAudio] = useState(new Audio(invalidMoveSound.default));
    const [removeStoneAudio] = useState(new Audio(removeStoneSound.default));

    const blackTurn = game.black.turn;

    const initConnection = useCallback(() => {
        socket.connect(dispatch);
    }, [dispatch, socket]);

    useEffect(() => {
        invalidActionAudio.currentTime = 0;
        placeStoneAudio.currentTime = 0;
        removeStoneAudio.currentTime = 0;
        switch (actionState) {
            case GameActionState.FAIL:
                invalidActionAudio.play();
                return;
            case GameActionState.SUCCESS:
                placeStoneAudio.play();
                return;
            case GameActionState.SUCCESS_REMOVE_STONE:
                placeStoneAudio.play();
                removeStoneAudio.play();
                return;
            case GameActionState.PENDING:
            case GameActionState.NONE:
            default:
                placeStoneAudio.pause();
                invalidActionAudio.pause();
                removeStoneAudio.pause();
                return;
        }
    }, [actionState, placeStoneAudio, invalidActionAudio, removeStoneAudio]);


    useEffect(() => {
        initConnection();
        return () => {
            socket.disconnect();
        };
    }, [initConnection, socket]);

    const handleClick = (x: number, y: number) => {
        if (!gameState.game.inGame) {
            return;
        }
        const color = blackTurn ? 'B' : 'W';
        dispatch(placeStone(color, x, y));  
    };

    const handleStartClick = () => {
        dispatch(startGame());
    };

    const handleUndoClick = () => {
        dispatch(undo());
    };

    const handleStopClick = () => {
        dispatch(stopGame());
    };

    const handleChartClick = () => {
        console.log('chart');
    };

    const handleAnalysisClick = () => {
        console.log('analysis');
    };
    
    const iconFill = '#fff';
    
    return <div>
        <Grid container spacing={1}>
            <Grid container item xs={7} spacing={0} className={classes.leftContainer}>
                <Grid item xs={12}>
                    <Paper className={`${classes.paper} ${classes.boardActionPanel}`}>
                        <Grid container spacing={0}>
                            <Grid item xs={6} spacing={0}>
                                <RightOne theme="outline" size="24" fill={iconFill} className={classes.icon} onClick={() => handleStartClick()}/>
                                <Undo theme="outline" size="24" fill={iconFill} className={classes.icon} onClick={() => handleUndoClick()}/>
                                <CloseOne theme="outline" size="24" fill={iconFill} className={classes.icon} onClick={() => handleStopClick()}/>
                            </Grid>
                            <Grid item xs={6} spacing={0} className={classes.graphButtons}>
                                <ChartHistogram theme="outline" size="24" fill={iconFill} className={classes.icon} onClick={() => handleChartClick()}/>
                                <Analysis theme="outline" size="24" fill={iconFill} className={classes.icon} onClick={() => handleAnalysisClick()}/>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} className={classes.boardGrid}>
                    <Paper className={`${classes.paper} ${classes.board}`}>
                        <SGFBoard click={(x, y) => handleClick(x, y)} 
                            currentMove={currentMove}
                            policy={policy} 
                            moveInfos={moveInfos} 
                            stones={stones}
                            ownership={ownership}
                            hoverEffect={true}/>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={5}>
                <GameInformation/>
            </Grid>
        </Grid>
    </div>;
}