import { CLEAR_RESULT, KatagoAction, SET_KATAGO_RESULT } from 'actions/katago';
import { InitialKatagoState } from 'models/Katago';
import {KatagoState} from 'models/StoreState';

const initialState = InitialKatagoState;

export function katagoReducer(state: KatagoState = initialState, action: KatagoAction): KatagoState {
    switch (action.type) {
        case SET_KATAGO_RESULT:
            return {
                katagoResult: action.payload.katagoResult,
                hasResult: action.payload.hasResult
            }
        case CLEAR_RESULT:
            return { ...state, hasResult: false }
        default:
            return state;
    }
}
