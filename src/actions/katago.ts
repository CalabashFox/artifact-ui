import { KatagoResult } from "models/Katago"

export const SET_KATAGO_RESULT = "SET_KATAGO_RESULT"
export type SET_KATAGO_RESULT = typeof SET_KATAGO_RESULT

export const CLEAR_RESULT = "CLEAR_RESULT"
export type CLEAR_RESULT = typeof CLEAR_RESULT

export interface SetKatagoResult {
    type: SET_KATAGO_RESULT,
    payload: {
        katagoResult: KatagoResult
        hasResult: boolean
    }
}
export interface ClearResult {
    type: CLEAR_RESULT,
    payload: {}
}

export type KatagoAction = SetKatagoResult | ClearResult

export const setKatagoResult = (katagoResult: KatagoResult): KatagoAction => {
    return {
        type: SET_KATAGO_RESULT,
        payload: {
            katagoResult: katagoResult,
            hasResult: true
        }
    }; 
}

export const clearResult = (): KatagoAction => {
    return {
        type: CLEAR_RESULT,
        payload: {}
    };
}
