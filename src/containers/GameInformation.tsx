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

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(1)
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.primary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
        backgroundColor: theme.palette.primary.main
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
    whitePlayer: {
        color: '#ffffff'
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
        backgroundColor: '#000',
        color: '#fff'
    },
    whiteStatus: {
        backgroundColor: '#fff',
        color: '#000'
    },
    graphContainer: {
        boxSizing: 'border-box',
        padding: theme.spacing(1)
    },
    divider: {
        color: '#fff',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    info: {
        color: '#fff'
    },
    icon: {
        color: '#fff',
        verticalAlign: 'middle',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    disabledIcon: {
        color: '#ccc',
        verticalAlign: 'middle',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    iconText: {
        display: 'inline-block',
        verticalAlign: 'middle',
        lineHeight: '24px'
    },
    iconButton: {
        display: 'inline-flex',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    disabledIconButton: {
        display: 'inline-flex',
        '&:hover': {
            cursor: 'not-allowed'
        }
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
    
    return <div>
        <Paper className={classes.paper}>
            <Grid container spacing={1} className={classes.info}>
                <Grid item xs={12}>
                    <Typography variant="body1" className={classes.iconButton} onClick={() => handleStartClick()}>
                        <RightOne theme="outline" size="24" fill={'#fff'} className={classes.icon}/>
                        <span className={classes.iconText}>Start</span>
                    </Typography>
                    <Typography variant="body1" className={classes.iconButton} onClick={() => handleUndoClick()}>
                    <Undo theme="outline" size="24" fill={'#fff'} className={classes.icon}/>
                        <span className={classes.iconText}>Undo</span>
                    </Typography>
                    <Typography variant="body1" className={classes.iconButton} onClick={() => handleStopClick()}>
                    <CloseOne theme="outline" size="24" fill={'#fff'} className={classes.icon}/>
                        <span className={classes.iconText}>Stop</span>
                    </Typography>
                </Grid>
            </Grid>
            <Divider className={classes.divider}/>
            <Grid container spacing={1}>
                <Grid item xs={6} className={classes.blackPlayer}>
                    <img src={black.turn ? blackTurnIcon : blackIcon} className={classes.playerTitle} alt="black"/>
                    <Typography className={classes.playerTitle} noWrap>
                        {black.isHuman ? 'Human' : 'AI'}
                    </Typography>
                </Grid>
                <Grid item xs={6} className={classes.whitePlayer}>
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
                    inputProps={{
                        readOnly: true
                    }}/>
            </Grid>
        </Paper>
    </div>;
};

export default GameInformation;