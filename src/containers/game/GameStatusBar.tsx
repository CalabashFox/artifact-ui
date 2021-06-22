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
import GameSettingsDialog from 'components/game/GameSettingsDialog';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
    container: {
        height: '24px'
    },
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
    const { t } = useTranslation();
    
    const game = gameState.game;
    
    const [sgfBoardSettingsOpen, setSGFBoardSettingsOpen] = useState(false);
    const [gameSettingsOpen, setGameSettingsOpen] = useState(false);
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

    const startButton = useIconText(<Checkerboard/>, t('ui.game.startGame'), () => handleGameDialog());
    const undoButton = useIconText(<Undo/>, t('ui.game.undo'), () => handleUndoClick());
    const stopButton = useIconText(<CloseOne/>, t('ui.game.stop'), () => handleStopClick());

    const handleUndoClick = () => {
        dispatch(undo());
    };

    const handleStopClick = () => {
        dispatch(stopGame());
    };

    const handleGameDialog = () => {
        if (gameState.game.inGame) {
            return;
        }
        setGameSettingsOpen(true);
    };

    return <React.Fragment>
        <SGFBoardSettings open={sgfBoardSettingsOpen} onClose={() => setSGFBoardSettingsOpen(false)}/>
        <GameSettingsDialog open={gameSettingsOpen} onClose={() => setGameSettingsOpen(false)}/>
        <Grid container className={classes.container}>
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