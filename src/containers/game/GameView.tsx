import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GameState, KatagoState, StoreState} from "models/StoreState";
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SGFBoard from 'components/SGFBoard';
import {ChartHistogram, Analysis} from '@icon-park/react'
import { placeStone, setKatagoTurn } from "actions/game";
import GameInformation from "./GameInformation";
import { GameActionState } from "models/Game";
import useIcon from "components/hook/icon";
import SGFBoardSound from "components/SGFBoardSound";
import useCurrentSnapshot from "components/hook/currentSnapshot";

const useStyles = makeStyles((theme) => ({
    graphButtons: {
        textAlign: 'right'
    },
    grid: {
        [theme.breakpoints.down('xs')]: {
            '&.MuiGrid-spacing-xs-1': {
                width: '100%',
                margin: 0
            },
            '& > .MuiGrid-item': {
                padding: 0,
                margin: 0
            }
        }
    },
    boardContainer: {
        alignContent: 'baseline',
        order: 1,
    },
    infoContainer: {
        order: 2,
        padding: 0,
        margin: 0,
        [theme.breakpoints.down('xs')]: {
            order: 0
        },
    }
}));

const GameView: React.FC = () => {
    const gameState = useSelector<StoreState, GameState>(state => state.gameState);
    const katagoState = useSelector<StoreState, KatagoState>(state => state.katagoState);
    const classes = useStyles();
    const dispatch = useDispatch();
    const snapshot = useCurrentSnapshot();
    const game = gameState.game;
    
    const stones = game.stones;
    const currentMove = game.currentMove;
    const {policy, ownership, moveInfos} = katagoState.katagoResult;

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

    SGFBoardSound(gameState.actionState);

    const handleClick = (x: number, y: number) => {
        if (!gameState.game.inGame || (blackTurn && blackHuman) || (whiteTurn && whiteHuman)) {
            return;
        }
        dispatch(placeStone(blackTurn ? 'B' : 'W', x, y));  
    };

    const handleChartClick = () => {
        console.log('chart');
    };

    const handleAnalysisClick = () => {
        console.log('analysis');
    };
    
    const chartIcon = useIcon(<ChartHistogram onClick={() => handleChartClick()}/>);
    const analysisIcon = useIcon(<Analysis onClick={() => handleAnalysisClick()}/>);
    
    return <React.Fragment>
        <Grid container direction="row" spacing={1} className={classes.grid}>
            <Grid item sm={7} xs={12} className={classes.boardContainer}>
                {game.inGame && <Paper>
                    <Grid container spacing={0}>
                        <Grid item xs={6} spacing={0}>
                        </Grid>
                        <Grid item xs={6} spacing={0} className={classes.graphButtons}>
                            {chartIcon}
                            {analysisIcon}
                        </Grid>
                    </Grid>
                </Paper>}
                <Paper>
                    <SGFBoard click={(x, y) => handleClick(x, y)} 
                        snapshot={snapshot}
                        currentMove={currentMove}
                        policy={policy} 
                        moveInfos={moveInfos} 
                        stones={stones}
                        ownership={ownership}
                        hoverEffect={hoverEffect}/>
                </Paper>
            </Grid>
            <Grid item sm={5} xs={12} className={classes.infoContainer}>
                <GameInformation/>
            </Grid>
        </Grid>
    </React.Fragment>;
}
export default GameView;