import React, { useEffect, useRef } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {GameState, StoreState} from 'models/StoreState';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import blackIcon from 'assets/images/black.svg';
import blackTurnIcon from 'assets/images/black-turn.svg';
import whiteIcon from 'assets/images/white.svg';
import whiteTurnIcon from 'assets/images/white-turn.svg';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import {Undo, CloseOne, RightOne} from '@icon-park/react'
import { startGame, stopGame, undo } from 'actions/game';
import useIconText from 'components/iconText';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(1)
    },
    logContainer: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        fontSize: 12
    },
    logField: {
        backgroundColor: theme.palette.primary.main,
        width: '100%'
    },
    blackPlayer: {
        color: '#000000'
    },
    playerTitle: {
        fontSize: 20,
        display: 'inline-block',
        verticalAlign: 'middle',
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    },
    statusContainer: {
        width: '100%'
    },
    status: {
        height: 20,
        display: 'inline-block',
        textAlign: 'center'
    },
    blackStatus: {
        backgroundColor: '#000000',
        color: '#fffff3'
    },
    whiteStatus: {
        backgroundColor: '#fffff3',
        color: '#000'
    }
}));

const GameInformation: React.FC = () => {
    const gameState = useSelector<StoreState, GameState>(state => state.gameState);
    const classes = useStyles();
    const dispatch = useDispatch();
    
    const game = gameState.game;
    const black = game.black;
    const white = game.white;

    const logs = gameState.logs;

    const logContent = logs.length === 0 ? '\n' : logs.map((log) => {
        return `(${log.timestamp}): ${log.text}`;
    }).join('\n');

    const logElement = useRef<HTMLInputElement>();

    useEffect(() => {
        const elem = logElement.current ?? new HTMLInputElement();
        elem.scrollTop = elem.scrollHeight ?? 0;
    }, [logs]);

    const handleStartClick = () => {
        dispatch(startGame());
    };

    const handleUndoClick = () => {
        dispatch(undo());
    };

    const handleStopClick = () => {
        dispatch(stopGame());
    };

    const startButton = useIconText(<RightOne/>, 'Start', () => handleStartClick);
    const undoButton = useIconText(<Undo/>, 'Undo', () => handleUndoClick());
    const stopButton = useIconText(<CloseOne/>, 'Stop', () => handleStopClick());
    
    return <React.Fragment>
        <Paper>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    {startButton}
                    {undoButton}
                    {stopButton}
                </Grid>
            </Grid>
            <Divider/>
            <Grid container spacing={1}>
                <Grid item xs={6} className={classes.blackPlayer}>
                    <img src={black.turn ? blackTurnIcon : blackIcon} className={classes.playerTitle} alt="black"/>
                    <Typography className={classes.playerTitle} noWrap>
                        {black.isHuman ? 'Human' : 'AI'}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <img src={white.turn ? whiteTurnIcon : whiteIcon} className={classes.playerTitle} alt="white"/>
                    <Typography className={classes.playerTitle} noWrap>
                        {white.isHuman ? 'Human' : 'AI'}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item xs={6} className={classes.blackPlayer}>
                    <Typography className={classes.playerTitle} noWrap>

                    </Typography>
                </Grid>
            </Grid>
        </Paper>
        <Paper className={classes.logContainer}>
            <Grid container spacing={1}> 
                <TextField
                    inputRef={logElement}
                    className={classes.logField}
                    label="Katago log"
                    multiline
                    rows={12}
                    value={logContent}
                    variant="outlined"
                    disabled={true}
                    inputProps={{
                        readOnly: true
                    }}/>
            </Grid>
        </Paper>
    </React.Fragment>;
};

export default GameInformation;