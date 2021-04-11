import React from "react";
import {useSelector} from "react-redux";
import {GameState, KatagoState, SGFState, StoreState} from "models/StoreState";
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'
import SGFBoard from 'components/SGFBoard';
import SGFInformation from './SGFInformation';
import withWidth, {WithWidth} from '@material-ui/core/withWidth';
import SGFBoardSound from 'components/SGFBoardSound';
import SGFBoardPanel from 'components/sgf/SGFBoardPanel';
import useNavigation from 'components/hook/navigation';
import { SGFStone } from "models/SGF";
import { KatagoMoveInfo } from "models/Katago";
import SGFDisplaySettings from "./SGFDisplaySettings";
import SGFModeSettings from "./SGFModeSettings";
import useValidSGF from "components/hook/validSGF";
import useCurrentSnapshot from "components/hook/currentSnapshot";

const useStyles = makeStyles((theme) => ({
    grid: {
        [theme.breakpoints.down('xs')]: {
            '&.MuiGrid-spacing-xs-1': {
                width: '100%',
                margin: 0
            },
            '& > .MuiGrid-item': {
                padding: 0,
                margin: 0
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
    const katagoState = useSelector<StoreState, KatagoState>(state => state.katagoState);
    const validSGF = useValidSGF();
    const snapshot = useCurrentSnapshot();
    
    const classes = useStyles();

    const [navigateBackward, navigateForward] = useNavigation();

    const handleClick = (x: number, y: number) => {
        if (!sgfState.sgfProperties.editMode) {
            return;
        }
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
    let currentMove = 0;
    let stones: Array<SGFStone> = [];
    let ownership: Array<number> = [];
    let policy: Array<number> = [];
    let moveInfos: Array<KatagoMoveInfo> = [];
    if (validSGF && snapshot !== null) {
        currentMove = sgfState.sgfProperties.currentMove;
        stones = snapshot.stones;
        if (sgfState.sgfProperties.liveMode) {
            ownership = katagoState.katagoResult.ownership;
            policy = katagoState.katagoResult.policy;
            moveInfos = katagoState.katagoResult.moveInfos;
        } else if (snapshot !== null && snapshot.katagoResult !== null) {
            ownership = snapshot.katagoResult.ownership;
            policy = snapshot.katagoResult.policy;
            moveInfos = snapshot.katagoResult.moveInfos;
        }
    }

    return <React.Fragment>
        <Grid container direction="row" spacing={1} className={classes.grid}>
            <Grid item sm={7} xs={12} className={classes.boardContainer}>
                <Paper>
                    <SGFModeSettings/>
                </Paper>
                {validSGF && <Paper>
                    <SGFDisplaySettings/>
                </Paper>}
                <Paper onWheel={e => scroll(e)}>
                    <SGFBoard click={(x, y) => handleClick(x, y)}
                        currentMove={currentMove}
                        policy={policy} 
                        moveInfos={moveInfos} 
                        stones={stones}
                        ownership={ownership}
                        hoverEffect={sgfState.sgfProperties.editMode}/>
                </Paper>
                {validSGF && <Paper>
                    <SGFBoardPanel/>
                </Paper>}
            </Grid>
            <Grid item sm={5} xs={12} className={classes.infoContainer}>
                <SGFInformation/>
            </Grid>
        </Grid>
    </React.Fragment>;
}

export default withWidth()(SGFView);