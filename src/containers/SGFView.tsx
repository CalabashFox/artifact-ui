import React from "react";
import {useSelector} from "react-redux";
import {GameState, SGFState, StoreState} from "models/StoreState";
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SGFBoard from './SGFBoard';
import SGFInformation from './SGFInformation';
import withWidth, {WithWidth} from '@material-ui/core/withWidth';
import SGFBoardSound from "components/SGFBoardSound";
import SGFBoardPanel from "components/SGFBoardPanel";
import useNavigation from "components/navigation";

const useStyles = makeStyles((theme) => ({
    grid: {
        [theme.breakpoints.down('xs')]: {
            '& > .MuiGrid-item': {
                padding: 0
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

const SGFView: React.FC<WithWidth> = ({width}) => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const gameState = useSelector<StoreState, GameState>(state => state.gameState);
    const classes = useStyles();

    const [navigateBackward, navigateForward] = useNavigation();

    const handleClick = (x: number, y: number) => {
        console.log(x, y);
    };

    const scroll = (event: React.WheelEvent) => {
        if (width === 'xs') {
            return;
        }
        const delta = event.deltaY;
        const steps = Math.abs(Math.floor(delta / 2));
        if (delta < 0) {
            navigateBackward(steps);
        } else {
            navigateForward(steps);
        }
    };

    if (sgfState.sgfProperties.useSound) {
        SGFBoardSound(gameState.actionState);
    }

    const snapshot = sgfState.analyzedSGF.snapshotList[sgfState.sgfProperties.currentMove];

    const hasKatagoResult = sgfState.hasSGF && snapshot.katagoResults.length > 0;
    
    const currentMove = sgfState.sgfProperties.currentMove;
    const stones = sgfState.hasSGF ? snapshot.stones : [];
    const ownership = hasKatagoResult ? snapshot.katagoResults[0].ownership : [];
    const policy = hasKatagoResult ? snapshot.katagoResults[0].policy : [];
    const moveInfos = hasKatagoResult ? snapshot.katagoResults[0].moveInfos : [];

    return <React.Fragment>
        <Grid container direction="row" spacing={1} className={classes.grid}>
            <Grid item sm={7} xs={12} className={classes.boardContainer}>
                <Paper onWheel={e => scroll(e)}>
                    <SGFBoard click={(x, y) => handleClick(x, y)}
                        currentMove={currentMove}
                        policy={policy} 
                        moveInfos={moveInfos} 
                        stones={stones}
                        ownership={ownership}
                        hoverEffect={false}/>
                </Paper>
                <Paper>
                    <SGFBoardPanel/>
                </Paper>
            </Grid>
            <Grid item sm={5} xs={12} className={classes.infoContainer}>
                <SGFInformation/>
            </Grid>
        </Grid>
    </React.Fragment>;
}

export default withWidth()(SGFView);