import {StoreState} from 'models/StoreState';
import {sgfReducer} from 'reducers/sgf';
import {viewReducer} from 'reducers/view';
import {combineReducers} from 'redux';
import {authReducer} from 'reducers/auth';
import { gameReducer } from 'reducers/game';
import { katagoReducer } from 'reducers/katago';
import { recordingReducer } from 'reducers/recording';

export const rootReducer = combineReducers<StoreState>({
    sgfState: sgfReducer,
    authState: authReducer,
    viewState: viewReducer,
    gameState: gameReducer,
    katagoState: katagoReducer,
    recordingState: recordingReducer
});
