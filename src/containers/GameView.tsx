import React, {ReactElement,useCallback,useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GameState, StoreState} from "models/StoreState";
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SGFBoard from './SGFBoard';
import {Left, DoubleLeft, ToLeft, Right, DoubleRight, ToRight, ChartHistogram, Analysis, Download} from '@icon-park/react'
import { placeStone, startGame } from "actions/game";
import SocketHandler from "utils/socketHandler";
import GameInformation from "./GameInformation";
import * as x from 'assets/audio/placestone.mp3';

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
    const classes = useStyles();
    const dispatch = useDispatch();
    const game = gameState.game;
    
    const stones = game.stones;
    const currentMove = game.currentMove;
    const {policy, ownership, moveInfos} = gameState.currentResult;

    const [socket] = useState(new SocketHandler(dispatch));

    const blackTurn = stones.length % 2 === 0;

    let placeStoneSound = null;

    const initConnection = useCallback(() => {
        dispatch(startGame());
        socket.connect();
    }, [dispatch, socket]);

    useEffect(() => {
        initConnection();
        return () => {
            socket.disconnect();
        };
    }, [initConnection, socket]);

    const handleClick = (x: number, y: number) => {    
        placeStoneSound = new Audio('');
        dispatch(placeStone(blackTurn ? 'B' : 'W', x, y));
        placeStoneSound.play();
    };
    
    const iconFill = '#fff';
    const disabledIconFill = '#ccc';
    
    const navBack = false;
    const navForward = true;

    const navBackFill = navBack ? iconFill : disabledIconFill;
    const navForwardFill = navForward ? iconFill : disabledIconFill;

    const navBackStyle = navBack ? classes.icon : classes.disabledIcon;
    const navForwardStyle = navForward ? classes.icon : classes.disabledIcon;
    
    return <div>
        <Grid container spacing={1}>
            <Grid container item xs={7} spacing={0} className={classes.leftContainer}>
                <Grid item xs={12}>
                    <Paper className={`${classes.paper} ${classes.boardActionPanel}`}>
                        <Grid container spacing={0}>
                            <Grid item xs={8} spacing={0}>
                                <ToLeft theme="outline" size="24" fill={navBackFill} className={navBackStyle} onClick={() => console.log('')} />
                                <DoubleLeft theme="outline" size="24" fill={navBackFill} className={navBackStyle} onClick={() => console.log(10)} />
                                <Left theme="outline" size="24" fill={navBackFill} className={navBackStyle} onClick={() => console.log(1)} />
                                <Right theme="outline" size="24" fill={navForwardFill} className={navForwardStyle} onClick={() => console.log(1)} />
                                <DoubleRight theme="outline" size="24" fill={navForwardFill} className={navForwardStyle} onClick={() => console.log(10)} />
                                <ToRight theme="outline" size="24" fill={navForwardFill} className={navForwardStyle} onClick={() => console.log(1)} />
                            </Grid>
                            <Grid item xs={4} spacing={0} className={classes.graphButtons}>
                                <ChartHistogram theme="outline" size="24" fill={iconFill} className={classes.icon}/>
                                <Analysis theme="outline" size="24" fill={iconFill} className={classes.icon} onClick={() => console.log(true)}/>
                                <Download theme="outline" size="24" fill={iconFill} className={classes.icon}/>
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