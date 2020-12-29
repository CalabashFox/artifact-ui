import {StoreState} from 'models/StoreState';
import {sgfReducer} from 'reducers/sgf';
import {combineReducers} from 'redux';
import {authReducer} from 'reducers/auth';

export const rootReducer = combineReducers<StoreState>({
    sgfState: sgfReducer,
    authState: authReducer
});
