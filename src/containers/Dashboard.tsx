import React, {useCallback, useEffect} from 'react';
//import SGFView from './SGFView';
import GameView from './GameView';
import {useDispatch, useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import {makeStyles} from '@material-ui/core/styles';
import {AnalyzedSGF} from 'models/SGF';
import * as mock from 'assets/sample.json'
import {set} from 'actions/sgf';
import { setView } from 'actions/view';

const useStyles = makeStyles((theme) => ({
    dashboard: {
        padding: theme.spacing(1),
        boxSizing: 'border-box'
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
    return <div className={classes.dashboard}>
        <GameView/>
        {/*<SGFView/>*/}
    </div>;
};



export default Dashboard;