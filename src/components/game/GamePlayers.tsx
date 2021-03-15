import React from 'react';
import {useSelector} from 'react-redux';
import {GameState, StoreState} from 'models/StoreState';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import blackIcon from 'assets/images/black.svg';
import blackTurnIcon from 'assets/images/black-turn.svg';
import whiteIcon from 'assets/images/white.svg';
import whiteTurnIcon from 'assets/images/white-turn.svg';

const useStyles = makeStyles((theme) => ({    
    blackPlayer: {
        color: '#000000'
    },
    playerTitle: {
        fontSize: 18,
        lineHeight: '18px',
        display: 'inline-block',
        verticalAlign: 'middle',
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    },
}));

const GamePlayers: React.FC = () => {
    const gameState = useSelector<StoreState, GameState>(state => state.gameState);
    const classes = useStyles();
    
    const game = gameState.game;
    const black = game.black;
    const white = game.white;
    
    return <React.Fragment>
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
    </React.Fragment>;
};

export default GamePlayers;