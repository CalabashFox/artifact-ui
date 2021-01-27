export const SET_VIEW = "SET_VIEW"
export type SET_VIEW = typeof SET_VIEW

export interface SetViewAction {
    type: SET_VIEW,
    payload: {
        infoWidth: number,
        screenWidth: number
    }
}

export type ViewAction = SetViewAction

export const setView = (infoWidth: number, screenWidth: number): ViewAction => {
    return {
        type: SET_VIEW,
        payload: {
            infoWidth, screenWidth 
        }
    };
}
