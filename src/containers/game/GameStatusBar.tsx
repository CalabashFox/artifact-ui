import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {GameState, StoreState} from 'models/StoreState';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import useIconText from 'components/hook/iconText';
import useIcon from 'components/hook/icon';
import {Undo, CloseOne, Checkerboard} from '@icon-park/react'
import {Info, Config} from '@icon-park/react'
import Popover from '@material-ui/core/Popover';

import GameData from 'components/game/GameData';
import { stopGame, undo } from 'actions/game';
import SGFBoardSettings from 'components/SGFBoardSettings';
import GameSettings from 'components/game/GameSettings';

const useStyles = makeStyles(() => ({
    statusContainer: {
        textAlign: 'left'
    },
    infoContainer: {
        textAlign: 'right'
    },
    input: {
        display: 'none',
    },
    popover: {
        pointerEvents: 'none'
    },
}));

const GameStatusBar: React.FC = () => {
    const gameState = useSelector<StoreState, GameState>(state => state.gameState);
    const classes = useStyles();
    const dispatch = useDispatch();
    
    const game = gameState.game;
    
    const [sgfBoardSettingsOpen, setSGFBoardSettingsOpen] = useState(false);
    const [gameSettingsOpen, setGameSettingsOpen] = useState(true);
    const [gameInfoAnchorElement, setGameInfoAnchorElement] = React.useState<HTMLElement | null>(null);
    const gameInfoOpen = Boolean(gameInfoAnchorElement);

    const handleOpenGameInfo = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setGameInfoAnchorElement(event.currentTarget);
    };

    const handleCloseGameInfo = () => {
        setGameInfoAnchorElement(null);
    };
    
    const infoIcon = useIcon(<Info onClick={handleOpenGameInfo} onMouseEnter={handleOpenGameInfo} onMouseLeave={handleCloseGameInfo}/>);
    const settingsIcon = useIcon(<Config onClick={() => setSGFBoardSettingsOpen(true)}/>);

    const startButton = useIconText(<Checkerboard/>, 'Start game', () => setGameSettingsOpen(true));
    const undoButton = useIconText(<Undo/>, 'Undo', () => handleUndoClick());
    const stopButton = useIconText(<CloseOne/>, 'Stop', () => handleStopClick());

    const handleUndoClick = () => {
        dispatch(undo());
    };

    const handleStopClick = () => {
        dispatch(stopGame());
    };

    return <React.Fragment>
        <SGFBoardSettings open={sgfBoardSettingsOpen} onClose={() => setSGFBoardSettingsOpen(false)}/>
        <GameSettings open={gameSettingsOpen} onClose={() => setGameSettingsOpen(false)}/>
        <Grid container>
            <Grid item xs={6} className={classes.statusContainer}>
                {!game.inGame && startButton}
                {game.inGame && undoButton}
                {game.inGame && stopButton}
            </Grid>
            <Grid item xs={6} className={classes.infoContainer}>
                {game.inGame && infoIcon}
                {game.inGame && <Popover
                    className={classes.popover}
                    open={gameInfoOpen}
                    anchorEl={gameInfoAnchorElement}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={handleCloseGameInfo}
                    disableRestoreFocus>
                    <GameData/>
                </Popover>}
                {settingsIcon}
            </Grid>
        </Grid>
    </React.Fragment>;
}

export default GameStatusBar;