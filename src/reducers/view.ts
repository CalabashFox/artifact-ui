import {ViewAction, SET_VIEW, SET_TAB, SET_LOADING, LOADING_COMPLETE} from 'actions/view';
import {ViewState} from 'models/StoreState';
import { InitialViewState } from 'models/view';

const initialState = InitialViewState;

export function viewReducer(state: ViewState = initialState, action: ViewAction): ViewState {
    switch (action.type) {
        case SET_VIEW:        
            return {
                ...state,
                infoWidth: action.payload.infoWidth,
                screenWidth: action.payload.screenWidth
            };
        case SET_TAB:
            return {
                ...state, tab: action.payload.tab
            };
        case SET_LOADING:
            return {
                ...state, loading: true, loadingText: action.payload.loadingText
            };
        case LOADING_COMPLETE:
            return {
                ...state, loading: false, loadingText: ''
            };
        default:
            return state;
    }
}
