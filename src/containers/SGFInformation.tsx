import React, {ReactElement} from 'react';
import {useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import SGFGraphTab from "components/SGFGraphTab";
import SGFPlayers from 'components/SGFPlayers';
import SGFStatusBar from 'components/SGFStatusBar';

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(1)
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.primary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        [theme.breakpoints.down('xs')]: {
            marginBottom: theme.spacing(0.5),
            borderRadius: 0
        }
    },
    divider: {
        color: '#fff',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}));

const SGFInformation = (): ReactElement => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();

    return <React.Fragment>
        <Paper className={classes.paper}>
            <Grid container spacing={1}>
                <SGFStatusBar/>
            </Grid>
            <Divider className={classes.divider}/>
            <Grid container spacing={1}>
                {sgfState.hasSGF && <SGFPlayers/>}
            </Grid>
        </Paper>
        <Paper className={classes.paper}>
            <SGFGraphTab/>
        </Paper>
    </React.Fragment>;
}

export default SGFInformation;