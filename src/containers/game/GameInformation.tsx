import React from 'react';
import {useSelector} from 'react-redux';
import {GameState, StoreState} from 'models/StoreState';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import GameStatusBar from 'containers/game/GameStatusBar';
import GamePlayers from 'components/game/GamePlayers';
import KatagoLog from 'components/KatagoLog';
const GameInformation: React.FC = () => {
    const gameState = useSelector<StoreState, GameState>(state => state.gameState);
    
    return <React.Fragment>
        <Paper>
            <GameStatusBar/>
            {gameState.game.inGame && <Divider/>}
            {gameState.game.inGame && <GamePlayers/>}
        </Paper>
        <Paper>
            <KatagoLog/>
        </Paper>
    </React.Fragment>;
};

export default GameInformation;