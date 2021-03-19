import { SocketConnectionState } from "models/view"

export const SET_VIEW = "SET_VIEW"
export type SET_VIEW = typeof SET_VIEW

export const SET_TAB = "SET_TAB"
export type SET_TAB = typeof SET_TAB

export const SET_LOADING = "SET_LOADING"
export type SET_LOADING = typeof SET_LOADING

export const LOADING_COMPLETE = "LOADING_COMPLETE"
export type LOADING_COMPLETE = typeof LOADING_COMPLETE

export const SET_SOCKET_CONNECTION_STATE = "SET_SOCKET_CONNECTION_STATE"
export type SET_SOCKET_CONNECTION_STATE = typeof SET_SOCKET_CONNECTION_STATE

export interface SetSocketConectionState {
    type: SET_SOCKET_CONNECTION_STATE,
    payload: {
        state: SocketConnectionState
    }
}

export interface SetViewAction {
    type: SET_VIEW,
    payload: {
        infoWidth: number
        screenWidth: number
    }
}

export interface LoadingComplete {
    type: LOADING_COMPLETE,
    payload: {}
}

export interface SetLoading {
    type: SET_LOADING,
    payload: {
        loadingText: string
    }
}

export interface SetTabAction {
    type: SET_TAB,
    payload: {
        tab: number
    }
}

export type ViewAction = SetViewAction | SetTabAction | SetLoading 
            | LoadingComplete | SetSocketConectionState;

export const setSocketConnectionState = (state: SocketConnectionState): ViewAction => {
    return {
        type: SET_SOCKET_CONNECTION_STATE,
        payload: {
            state: state
        }
    };
}

export const setLoading = (loadingText: string): ViewAction => {
    return {
        type: SET_LOADING,
        payload: {
            loadingText: loadingText
        }
    };
}
export const loadingComplete = (): ViewAction => {
    return {
        type: LOADING_COMPLETE,
        payload: {}
    };
}


export const setView = (infoWidth: number, screenWidth: number): ViewAction => {
    return {
        type: SET_VIEW,
        payload: {
            infoWidth, screenWidth 
        }
    };
}

export const setTab = (tab: number): ViewAction => {
    return {
        type: SET_TAB,
        payload: {
            tab: tab
        }
    };
}
