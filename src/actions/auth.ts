import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import {AxiosError, AxiosResponse} from 'axios';
import {AuthState} from 'models/StoreState';
import {ApiResponse, post} from '../api/api';
import {User} from 'models/User';
import TokenUtils from 'utils/tokenUtils';

export const LOGIN = 'LOGIN';
export type LOGIN = typeof LOGIN;

export const LOGOUT_COMPLETE = 'LOGOUT_COMPLETE';
export type LOGOUT_COMPLETE = typeof LOGOUT_COMPLETE;

export const LOADING = 'LOADING';
export type LOADING = typeof LOADING;

export const SET_AUTH_ERROR = 'SET_AUTH_ERROR';
export type SET_AUTH_ERROR = typeof SET_AUTH_ERROR;

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export type LOGIN_SUCCESS = typeof LOGIN_SUCCESS;

export const LOGIN_FAIL = 'LOGIN_FAIL';
export type LOGIN_FAIL = typeof LOGIN_FAIL;

export const AUTHORIZE = 'AUTHORIZE';
export type AUTHORIZE = typeof AUTHORIZE;

export interface LoginAction {
    type: LOGIN;
    payload: {
        email: string;
        password: string;
        rememberMe: boolean;
    };
}

export interface LogoutAction {
    type: LOGOUT_COMPLETE;
}

export interface LoadingAction {
    type: LOADING;
    payload: {
        loading: boolean;
    }
}

export interface SetAuthErrorAction {
    type: SET_AUTH_ERROR;
    payload:  {
        error: string | null;
    }
}

export interface LoginSuccess {
    type: LOGIN_SUCCESS;
    payload: {
        user: User;
        auth: string;
        rememberMe: boolean;
    }
}

export interface LoginFail {
    type: LOGIN_FAIL;
    payload: {
        message: string | null;
    }
}

export type AuthAction = LoginAction | LogoutAction | LoadingAction | SetAuthErrorAction | LoginSuccess | LoginFail;

export const logout = (): ThunkAction<Promise<void>, AuthState, null, AuthAction> => {
    return (dispatch: ThunkDispatch<AuthState, null, AuthAction>) => {
        dispatch(loading(true));
        return post<void>('auth/logout', {})
            .then(() => {
                dispatch(loading(false));
                dispatch(logoutComplete());
            });
    };
};

export const authorize = (auth: string, token: string)
    : ThunkAction<Promise<void>, AuthState, null, AuthAction> => {
    return (dispatch: ThunkDispatch<AuthState, null, AuthAction>) => {
        dispatch(loading(true));
        return post<User>('auth/validate',
            {
                token
            })
            .then((res: AxiosResponse<ApiResponse<User>>) => authSuccess(dispatch, res, true))
            .catch((err: AxiosError<ApiResponse<User>>) => authFail(dispatch, err))
            .then(() => authComplete(dispatch));
    };
};

export const login = (email: string, password: string, rememberMe: boolean)
    : ThunkAction<Promise<void>, AuthState, null, AuthAction> => {
    return (dispatch: ThunkDispatch<AuthState, null, AuthAction>) => {
        dispatch(loading(true));
        return post<User>('auth/login',
            {
                email,
                password,
                rememberMe
            })
            .then((res: AxiosResponse<ApiResponse<User>>) => authSuccess(dispatch, res, rememberMe))
            .catch((err: AxiosError<ApiResponse<User>>) => authFail(dispatch, err))
            .then(() => authComplete(dispatch));
    };
};

function authComplete(dispatch: ThunkDispatch<AuthState, null, AuthAction>) {
    dispatch(loading(false));
}

function authSuccess(dispatch: ThunkDispatch<AuthState, null, AuthAction>, res: AxiosResponse<ApiResponse<User>>, rememberMe: boolean) {
    const auth = TokenUtils.getAuthorization(res.headers['authorization']);
    dispatch(loginSuccess(res.data.entity, auth, rememberMe));
}

function authFail(dispatch: ThunkDispatch<AuthState, null, AuthAction>, err: AxiosError<ApiResponse<User>>) {
    if (err.response?.data.message) {
        dispatch(loginFail(err.response?.data.message));
    } else {
        dispatch(loginFail('Login failed'));
    }
}

export const loginSuccess = (user: User, auth: string, rememberMe: boolean): AuthAction => {
    return {
        type: LOGIN_SUCCESS,
        payload: {
            user,
            auth,
            rememberMe
        }
    };
}

export const loginFail = (message: string): AuthAction => {
    return {
        type: LOGIN_FAIL,
        payload: {
            message
        }
    };
}

export const loading = (loading: boolean): AuthAction => {
    return {
        type: LOADING,
        payload: {
            loading
        }
    }
}

export const logoutComplete = (): AuthAction => {
    return {
        type: LOGOUT_COMPLETE
    }
}

export const setAuthError = (error: string | null): AuthAction => {
    return {
        type: SET_AUTH_ERROR,
        payload: {
            error
        }
    };
};