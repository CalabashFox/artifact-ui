export const SET_VIEW = "SET_VIEW"
export type SET_VIEW = typeof SET_VIEW

export const SET_TAB = "SET_TAB"
export type SET_TAB = typeof SET_TAB

export interface SetViewAction {
    type: SET_VIEW,
    payload: {
        infoWidth: number,
        screenWidth: number
    }
}

export interface SetTabAction {
    type: SET_TAB,
    payload: {
        tab: number
    }
}

export type ViewAction = SetViewAction | SetTabAction

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
