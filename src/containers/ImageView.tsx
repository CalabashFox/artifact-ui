import React, {ReactElement} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SGFBoard from './SGFBoard';
import {ScreenshotTwo} from '@icon-park/react'
import { readImage } from "actions/sgf";

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
    board: {
        marginBottom: 0
    },
    leftContainer: {
        alignContent: 'baseline'
    },
    boardGrid: {
        marginBottom: theme.spacing(1)
    },
    icon: {
        color: '#fff',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        '&:hover': {
            cursor: 'pointer'
        }
    }
}));

export default function ImageView(): ReactElement {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleClick = (x: number, y: number) => {
        console.log(x, y);
    };

    const uploadImage = () => {
        dispatch(readImage());
    };

    const stones = sgfState.sgfImage.stones;
    
    return <div>
        <Grid container spacing={1}>
            <Grid container item xs={7} spacing={0} className={classes.leftContainer}>
                <Grid item xs={12} className={classes.boardGrid}>
                    <Paper className={`${classes.paper} ${classes.board}`} >
                    <SGFBoard click={(x, y) => handleClick(x, y)}
                        currentMove={0}
                        policy={[]} 
                        moveInfos={[]} 
                        stones={stones}
                        ownership={[]}
                        hoverEffect={false}/>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={5}>
                <ScreenshotTwo theme="outline" size="24" fill="#333" className={classes.icon} onClick={() => uploadImage()}/>
            </Grid>
        </Grid>
    </div>;
}