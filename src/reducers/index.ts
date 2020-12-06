import {StoreState} from 'models/StoreState';
import {gameReducer} from 'reducers/game';
import {combineReducers} from 'redux';
import {authReducer} from 'reducers/auth';

export const rootReducer = combineReducers<StoreState>({
    gameState: gameReducer,
    authState: authReducer
});
