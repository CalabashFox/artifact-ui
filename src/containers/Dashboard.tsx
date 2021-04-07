import React, {useCallback, useEffect, useState} from 'react';
import SGFView from './sgf/SGFView';
import GameView from './game/GameView';
import ImageView from './image/ImageView';
import {useDispatch, useSelector} from 'react-redux';
import {SGFState, StoreState, ViewState} from 'models/StoreState';
import {makeStyles} from '@material-ui/core/styles';
import {AnalyzedSGF} from 'models/SGF';
import * as mock from 'assets/sample.json'
import {receiveProgress, set} from 'actions/sgf';
import { setTab } from 'actions/view';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SocketHandler from "utils/socketHandler";
import { TAB_VIEW_GAME, TAB_VIEW_IMAGE, TAB_VIEW_SGF } from 'models/view';
import {ImageFiles} from '@icon-park/react'
import useIcon from "components/hook/icon";
import Snackbar from '@material-ui/core/Snackbar';
import ConnectionStatus from 'components/ConnectionStatus';

const useStyles = makeStyles((theme) => ({
    desktopAppBar: {
        padding: 0
    },
    tab: {
        fontSize: '1.2em'
    },
    navigation: {
        textAlign: 'center',
        color: theme.palette.text.primary,
        whiteSpace: 'nowrap',
        backgroundColor: theme.palette.primary.main
    },
    tabs: {
        textAlign: 'left'
    },
    connectionState: {
        textAlign: 'right',
        paddingRight: theme.spacing(1),
        fontSize: '1.2em'
    }
}));

const KeyEvent = {
    DOM_VK_CANCEL: 3,
    DOM_VK_HELP: 6,
    DOM_VK_BACK_SPACE: 8,
    DOM_VK_TAB: 9,
    DOM_VK_CLEAR: 12,
    DOM_VK_RETURN: 13,
    DOM_VK_ENTER: 14,
    DOM_VK_LEFT: 37,
    DOM_VK_UP: 38,
    DOM_VK_RIGHT: 39,
    DOM_VK_DOWN: 40,
    DOM_VK_PRINTSCREEN: 44,
    DOM_VK_INSERT: 45,
    DOM_VK_DELETE: 46,
};

const Dashboard: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const viewState = useSelector<StoreState, ViewState>(state => state.viewState);
    const classes = useStyles();
    const dispatch = useDispatch();

    const tabIndex = viewState.tab;

    const [socket] = useState(new SocketHandler());

    const initConnection = useCallback(() => {
        socket.connect(dispatch);
    }, [dispatch, socket]);

    useEffect(() => {
        initConnection();
        return () => {
            socket.disconnect();
        };
    }, [initConnection, socket]);

    const handleTabChange = (index: number) => {
        dispatch(setTab(index));
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        switch (parseInt(event.code)) {
            case KeyEvent.DOM_VK_UP:
                break;
            case KeyEvent.DOM_VK_DOWN:
                break;
            case KeyEvent.DOM_VK_LEFT:
                break;
            case KeyEvent.DOM_VK_RIGHT:
                break;
            case KeyEvent.DOM_VK_ENTER:
                break;
        }
    };

    const initFetch = useCallback(() => {
        const analyzedSGF = mock as unknown as AnalyzedSGF;
        dispatch(set(analyzedSGF));
        dispatch(receiveProgress({
            total: analyzedSGF.snapshotList.length,
            analyzed: analyzedSGF.snapshotList.length
        }));
    }, [dispatch]);

    useEffect(() => {
        initFetch();
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [initFetch]);

    const uploadIcon = useIcon(<ImageFiles title={'upload file'} />);

    if (sgfState.analyzedSGF === undefined) {
        return <React.Fragment>1</React.Fragment>
    }
    return <Container>
        <Snackbar
            anchorOrigin={{ 
                vertical: 'top',
                horizontal: 'center'
             }}
            open={viewState.loading}
            message={viewState.loadingText}/>
        <Hidden xsDown>
            <AppBar position="static" className={classes.desktopAppBar}>
                <Grid container>
                    <Grid item xs={9} className={classes.tabs}>
                        <Tabs value={tabIndex} onChange={(e, v) => handleTabChange(v)}>
                            <Tab label="Scanner" className={classes.tab}/>
                            <Tab label="Game" className={classes.tab}/>
                            <Tab label="SGF" className={classes.tab}/>
                        </Tabs>
                    </Grid>
                    <Grid item xs={3} className={classes.connectionState}>
                        <ConnectionStatus/>
                    </Grid>
                </Grid>
            </AppBar>
        </Hidden>
        {tabIndex === TAB_VIEW_IMAGE && <Container><ImageView/></Container>}
        {tabIndex === TAB_VIEW_GAME && <Container><GameView/></Container>}
        {tabIndex === TAB_VIEW_SGF && <Container><SGFView/></Container>}
        <Hidden smUp>
             <BottomNavigation value={tabIndex} onChange={(e, v) => handleTabChange(v)} className={classes.navigation}>
                 <BottomNavigationAction label="Scanner" value={TAB_VIEW_IMAGE} icon={uploadIcon} />
                 <BottomNavigationAction label="Game" value={TAB_VIEW_GAME} />
                 <BottomNavigationAction label="SGF" value={TAB_VIEW_SGF} />
            </BottomNavigation>
        </Hidden>
    </Container>;
}

export default Dashboard;