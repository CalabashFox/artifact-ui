import React from 'react';
import {useSelector} from 'react-redux';
import {GameState, StoreState} from 'models/StoreState';
import Grid from '@material-ui/core/Grid';
import SGFPlayer from 'components/sgf/SGFPlayer';
import { SGFColor } from 'models/SGF';

const GamePlayers: React.FC = () => {
    const gameState = useSelector<StoreState, GameState>(state => state.gameState);
    
    const game = gameState.game;
    const black = game.black;
    const white = game.white;
    
    return <React.Fragment>
        <Grid container spacing={1}>
            <Grid item xs={6}>
                <SGFPlayer 
                    color={SGFColor.BLACK}
                    name={black.isHuman ? 'Human' : 'AI'}
                    rank={''}
                    turn={black.turn}/>
            </Grid>
            <Grid item xs={6}>
                <SGFPlayer 
                    color={SGFColor.WHITE}
                    name={white.isHuman ? 'Human' : 'AI'}
                    rank={''}
                    turn={white.turn}/>
            </Grid>
        </Grid>
    </React.Fragment>;
};

export default GamePlayers;