import React, {ChangeEvent, ReactElement, useCallback, useEffect, useState} from 'react';
import SGFView from './SGFView';
import GameView from './GameView';
import ImageView from './ImageView';
import {useDispatch, useSelector} from 'react-redux';
import {SGFState, StoreState, ViewState} from 'models/StoreState';
import {makeStyles} from '@material-ui/core/styles';
import {AnalyzedSGF} from 'models/SGF';
import * as mock from 'assets/sample.json'
import {set} from 'actions/sgf';
import { setTab, setView } from 'actions/view';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SocketHandler from "utils/socketHandler";
import { TAB_VIEW_GAME, TAB_VIEW_IMAGE, TAB_VIEW_SGF } from 'models/view';
import {ImageFiles,} from '@icon-park/react'
import useIcon from "components/icon";
import withWidth, {WithWidth} from '@material-ui/core/withWidth';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
        boxSizing: 'border-box',
        [theme.breakpoints.down('xs')]: {
            padding: 0
        }
    },
    tab: {
        fontSize: '1.2em'
    },
    navigation: {
        textAlign: 'center',
        color: theme.palette.text.primary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
        backgroundColor: theme.palette.primary.main
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

function Dashboard(props: WithWidth): ReactElement {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const viewState = useSelector<StoreState, ViewState>(state => state.viewState);
    const classes = useStyles();
    const dispatch = useDispatch();

    const tabIndex = viewState.tab;

    const {width} = props;

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

    // eslint-disable-next-line @typescript-eslint/ban-types
    const handleTabChange = (event: ChangeEvent<{}>, index: number) => {
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
        dispatch(set(mock as unknown as AnalyzedSGF));
        if (width === 'xs') {
            dispatch(setView(window.innerWidth - 30, 1000));
        } else {
            dispatch(setView(Math.min(window.innerWidth - 30, 400), 1000));
        }
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
        return <div>1</div>
    }
    return <Container disableGutters={true}>
        <Hidden xsDown>
            <AppBar position="static">
                <Tabs value={tabIndex} onChange={(e, v) => handleTabChange(e, v)}>
                    <Tab label="Scanner" className={classes.tab}/>
                    <Tab label="Game" className={classes.tab}/>
                    <Tab label="SGF" className={classes.tab}/>
                </Tabs>
            </AppBar>
        </Hidden>
        {tabIndex === TAB_VIEW_IMAGE && <Container className={classes.container}><ImageView/></Container>}
        {tabIndex === TAB_VIEW_GAME && <Container className={classes.container}><GameView/></Container>}
        {tabIndex === TAB_VIEW_SGF && <Container className={classes.container}><SGFView/></Container>}
        <Hidden smUp>
             <BottomNavigation value={tabIndex} onChange={(e, v) => handleTabChange(e, v)} className={classes.navigation}>
                 <BottomNavigationAction label="Scanner" value={TAB_VIEW_IMAGE} icon={uploadIcon} />
                 <BottomNavigationAction label="Game" value={TAB_VIEW_GAME} />
                 <BottomNavigationAction label="SGF" value={TAB_VIEW_SGF} />
            </BottomNavigation>
        </Hidden>
    </Container>;
}

export default withWidth()(Dashboard);