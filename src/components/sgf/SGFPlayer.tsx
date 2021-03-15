import React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { SGFColor } from 'models/SGF';
import blackIcon from 'assets/images/black.svg';
import blackTurnIcon from 'assets/images/black-turn.svg';
import whiteIcon from 'assets/images/white.svg';
import whiteTurnIcon from 'assets/images/white-turn.svg';

const useStyles = makeStyles((theme: Theme) => ({
    whitePlayer: {
        color: '#fffff3'
    },
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
    playerStoneImage: {
        width: '24px',
        height: '24px',
        display: 'inline-block',
        verticalAlign: 'middle',
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    }
}));

interface SGFPlayerProps {
    color: SGFColor
    name: string
    rank: string
    turn: boolean
}

const SGFPlayer: React.FC<SGFPlayerProps> = ({color, name, rank, turn}) => {
    const classes = useStyles();

    const icon = color === SGFColor.BLACK ?
        (turn ? blackTurnIcon : blackIcon) 
        : (turn ? whiteTurnIcon : whiteIcon);

    const titleClass = color === SGFColor.BLACK ? classes.blackPlayer : classes.whitePlayer;

    return <React.Fragment>
        <img src={icon} className={classes.playerStoneImage} alt={name}/>
        <Typography className={[classes.playerTitle, titleClass].join(' ')} noWrap>
            {name}({rank})
        </Typography>
    </React.Fragment>;
}

export default SGFPlayer;