import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import SGFView from './SGFView';
import GameView from './GameView';
import ImageView from './ImageView';
import {useDispatch, useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import {makeStyles} from '@material-ui/core/styles';
import {AnalyzedSGF} from 'models/SGF';
import * as mock from 'assets/sample.json'
import {set} from 'actions/sgf';
import { setView } from 'actions/view';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import SocketHandler from "utils/socketHandler";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
        boxSizing: 'border-box'
    },
    tab: {
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
    const classes = useStyles();
    const dispatch = useDispatch();

    const [tabIndex, setTabIndex] = useState<number>(0);
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
        setTabIndex(index);
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
        dispatch(setView(400, 1000));

    }, [dispatch]);

    useEffect(() => {
        initFetch();
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [initFetch]);

    if (sgfState.analyzedSGF === undefined) {
        return <div>1</div>
    }
    return <Box>
        <AppBar position="static">
        <Tabs value={tabIndex} onChange={(e, v) => handleTabChange(e, v)}>
          <Tab label="Game" className={classes.tab}/>
          <Tab label="Scanner" className={classes.tab}/>
          <Tab label="SGF" className={classes.tab}/>
        </Tabs>
      </AppBar>
      {tabIndex === 0 && <Box className={classes.container}><GameView/></Box>}
      {tabIndex === 1 && <Box className={classes.container}><ImageView/></Box>}
      {tabIndex === 2 && <Box className={classes.container}><SGFView/></Box>}
    </Box>;
};



export default Dashboard;