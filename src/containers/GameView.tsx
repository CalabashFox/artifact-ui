import React, {ReactElement,useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GameState, KatagoState, StoreState} from "models/StoreState";
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SGFBoard from './SGFBoard';
import {ChartHistogram, Analysis} from '@icon-park/react'
import { placeStone, setKatagoTurn } from "actions/game";
import GameInformation from "./GameInformation";
import * as placeStoneSound from 'assets/audio/placestone.mp3';
import * as invalidMoveSound from 'assets/audio/invalidmove.mp3';
import * as removeStoneSound from 'assets/audio/removestone.mp3';
import { GameActionState } from "models/Game";
import useIcon from "components/icon";

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
        color: theme.palette.text.primary,
    },
    icon: {
        color: theme.palette.text.primary,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        '&:hover': {
            cursor: 'pointer'
        }
    },
    disabledIcon: {
        color: theme.palette.text.disabled,
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
    const katagoState = useSelector<StoreState, KatagoState>(state => state.katagoState);
    const actionState = gameState.actionState;
    const classes = useStyles();
    const dispatch = useDispatch();
    const game = gameState.game;
    
    const stones = game.stones;
    const currentMove = game.currentMove;
    const {policy, ownership, moveInfos} = katagoState.katagoResult;

    const [placeStoneAudio] = useState(new Audio(placeStoneSound.default));
    const [invalidActionAudio] = useState(new Audio(invalidMoveSound.default));
    const [removeStoneAudio] = useState(new Audio(removeStoneSound.default));

    const blackTurn = game.black.turn;
    const whiteTurn = game.white.turn;
    const blackHuman = game.black.isHuman;
    const whiteHuman = game.white.isHuman;

    const hoverEffect = (blackHuman && blackTurn) || (whiteHuman && whiteTurn);

    useEffect(() => {
        if ((!blackHuman && blackTurn) || (!whiteHuman && whiteTurn)) {
            setTimeout(() => {
                dispatch(setKatagoTurn(GameActionState.PENDING));
            }, 1000);
        }
    }, [dispatch, blackTurn, whiteTurn, blackHuman, whiteHuman]);

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

    const handleClick = (x: number, y: number) => {
        /*
         * 
        if (!gameState.game.inGame || (blackTurn && blackHuman) || (whiteTurn && whiteHuman)) {
            return;
        }
         */
        if (!gameState.game.inGame) {
            return;
        }
        const color = blackTurn ? 'B' : 'W';
        dispatch(placeStone(color, x, y));  
    };

    const handleChartClick = () => {
        console.log('chart');
    };

    const handleAnalysisClick = () => {
        console.log('analysis');
    };
    
    const chartIcon = useIcon(<ChartHistogram onClick={() => handleChartClick()}/>);
    const analysisIcon = useIcon(<Analysis onClick={() => handleAnalysisClick()}/>);
    
    return <div>
        <Grid container spacing={1}>
            <Grid container item xs={7} spacing={0} className={classes.leftContainer}>
                <Grid item xs={12}>
                    <Paper className={`${classes.paper} ${classes.boardActionPanel}`}>
                        <Grid container spacing={0}>
                            <Grid item xs={6} spacing={0}>
                            </Grid>
                            <Grid item xs={6} spacing={0} className={classes.graphButtons}>
                                {chartIcon}
                                {analysisIcon}
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
                            hoverEffect={hoverEffect}/>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={5}>
                <GameInformation/>
            </Grid>
        </Grid>
    </div>;
}