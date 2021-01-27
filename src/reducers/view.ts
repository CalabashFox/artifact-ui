import {ViewAction, SET_VIEW} from 'actions/view';
import {ViewState} from 'models/StoreState';
import { InitialViewState } from 'models/view';

const initialState = InitialViewState;

export function viewReducer(state: ViewState = initialState, action: ViewAction): ViewState {
    switch (action.type) {
        case SET_VIEW:        
            return {
                infoWidth: action.payload.infoWidth,
                screenWidth: action.payload.screenWidth
            };
        default:
            return state;
    }
}
