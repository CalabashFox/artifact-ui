import {AuthAction, LOADING, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_COMPLETE, SET_AUTH_ERROR} from 'actions/auth';
import {AuthState} from 'models/StoreState';
import { InitialAuthState } from 'models/User';
import TokenUtils from 'utils/tokenUtils';

const initialState = InitialAuthState;

export function authReducer(state: AuthState = initialState, action: AuthAction): AuthState {
    switch (action.type) {
        case LOGIN_SUCCESS:
            TokenUtils.setToken(action.payload.auth, action.payload.user.token);
            return {
                ...state, user: action.payload.user, auth: action.payload.auth
            };
        case LOGIN_FAIL:
            TokenUtils.expireToken();
            return {
                ...state, error: action.payload.message
            };
        case LOGOUT_COMPLETE:
            TokenUtils.expireToken();
            return {
                ...state, user: null, auth: null
            };
        case LOADING: {
            return {
                ...state, isLoading: action.payload.loading
            }
        }
        case SET_AUTH_ERROR:
            return {
                ...state, error: action.payload.error
            }
        default:
            return state;
    }
}
