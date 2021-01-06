import React, {ReactElement, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SGFBoard from './SGFBoard';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {setMove} from 'actions/sgf';
import TextField from '@material-ui/core/TextField';
import SGFInformation from './SGFInformation';

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
    },
    disabled: {
        color: theme.palette.text.disabled
    },
    board: {
        padding: theme.spacing(3)
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
    boardActionPanel: {
    },
    icon: {
        '&:hover': {
            cursor: 'pointer'
        }
    }
}));

const InputField = withStyles({
    root: {
        '& label': {
            display: 'none'
        },
        '& label + .MuiInput-formControl': {
            marginTop: 0
        },
        '& .MuiInputBase-input': {
            width: 50
        }
    }
})(TextField);

export default function SGFView(): ReactElement {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const dispatch = useDispatch();

    const totalMoves = (sgfState.analyzedSGF?.moves?.length ?? 1) - 1;
    const currentMove = sgfState.sgfProperties?.currentMove;

    const [moveText, setMoveText] = useState(currentMove);

    const updateMoveText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const move = Number.parseInt(event.target.value);
        if (!isNaN(move) && move >= 0 && move < totalMoves) {
            setMoveText(moveText);
            dispatch(setMove(move));
        }
    };

    const updateMove = (move: number) => {
        dispatch(setMove(move));
    }

    const navigateBackward = (increment: number) => {
        if (currentMove === 0) {
            return;
        }
        const move = currentMove - increment;
        if (move >= 0) {
            dispatch(setMove(move));
        } else {
            dispatch(setMove(0));
        }
    };

    const navigateForward = (increment: number) => {
        if (currentMove === totalMoves) {
            return;
        }
        const move = currentMove + increment;
        if (move < totalMoves) {
            dispatch(setMove(move));
        } else {
            dispatch(setMove(totalMoves));
        }
    };
    const scroll = (event: React.WheelEvent) => {
        const delta = event.deltaY;
        const steps = Math.abs(Math.floor(delta / 2));
        if (delta < 0) {
            navigateBackward(steps);
        } else {
            navigateForward(steps);
        }
    };

    useEffect(() => {
        setMoveText(currentMove);
    }, [currentMove]);

    return <div>
        <Grid container spacing={1}>
            <Grid container item xs={7}>
                <Grid item xs={12}>
                    <Paper className={`${classes.paper} ${classes.board}`} onWheel={(e) => scroll(e)}>
                        <SGFBoard/>
                    </Paper>
                </Grid>
                <Divider className={classes.divider} />
                <Grid item xs={12}>
                    <Paper className={`${classes.paper} ${classes.boardActionPanel}`}>
                        <FirstPageIcon className={classes.icon} fontSize="large" color={currentMove !== 0 ? 'primary' : 'disabled'} onClick={() => updateMove(0)} />
                        <NavigateBeforeIcon className={classes.icon} fontSize="large" color={currentMove !== 0 ? 'primary' : 'disabled'} onClick={() => navigateBackward(1)} />
                        <InputField label="move"
                                    value={moveText}
                                    size="small"
                                    type="number"
                                    onChange={updateMoveText}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}/>
                        <NavigateNextIcon className={classes.icon} fontSize="large" color={currentMove !== totalMoves - 1 ? 'primary' : 'disabled'} onClick={() => navigateForward(1)} />
                        <LastPageIcon className={classes.icon} fontSize="large" color={currentMove !== totalMoves - 1 ? 'primary' : 'disabled'} onClick={() => updateMove(totalMoves - 1)} />
                        <Grid container spacing={1}>

                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={5}>
                <SGFInformation/>
            </Grid>
        </Grid>
    </div>;
    /*
    if (authState.isLoading) {
        return <Loading/>;
    } else if (auth === "unauthorized" && authorized) {
        return <Redirect to="/dashboard" />;
    } else if (auth === "authorized" && !authorized) {
        return <Redirect to="/" />;
    } else {
        return <Route {...props} />;
    }*/
}