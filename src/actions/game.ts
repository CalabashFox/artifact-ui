import { ApiResponse, post } from "../api/api"
import { AxiosError, AxiosResponse } from "axios"
import { Color, EmptyResult, Game, GameActionState } from "models/Game"
import { GameState } from "models/StoreState"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { KatagoLog, KatagoResult } from "models/Katago"

export const START_GAME = "START_GAME"
export type START_GAME = typeof START_GAME

export const PLACE_STONE = "PLACE_STONE"
export type PLACE_STONE = typeof PLACE_STONE

export const ACTION_COMPLETED = "ACTION_COMPLETED"
export type ACTION_COMPLETED = typeof ACTION_COMPLETED

export const ACTION_FAILED = "ACTION_FAILED"
export type ACTION_FAILED = typeof ACTION_FAILED

export const ACTION_PENDING = "ACTION_PENDING"
export type ACTION_PENDING = typeof ACTION_PENDING

export const PLACE_STONE_SUCCESS =  "PLACE_STONE_SUCCESS"
export type PLACE_STONE_SUCCESS = typeof PLACE_STONE_SUCCESS

export const START_GAME_SUCCESS =  "START_GAME_SUCCESS"
export type START_GAME_SUCCESS = typeof START_GAME_SUCCESS

export const ACTION_STATE_UPDATE =  "ACTION_STATE_UPDATE"
export type ACTION_STATE_UPDATE = typeof ACTION_STATE_UPDATE

export const APPEND_LOG =  "APPEND_LOG"
export type APPEND_LOG = typeof APPEND_LOG

export const SET_KATAGO_ANALYSIS =  "SET_KATAGO_ANALYSIS"
export type SET_KATAGO_ANALYSIS = typeof SET_KATAGO_ANALYSIS

export const STOP_GAME =  "STOP_GAME"
export type STOP_GAME = typeof STOP_GAME

export const UNDO =  "UNDO"
export type UNDO = typeof UNDO

export const STOP_GAME_SUCCESS =  "STOP_GAME_SUCCESS"
export type STOP_GAME_SUCCESS = typeof STOP_GAME_SUCCESS

export interface Undo {
    type: UNDO,
    payload: {}
}

export interface StopGame {
    type: STOP_GAME,
    payload: {}
}

export interface SetKatagoAnalysis {
    type: SET_KATAGO_ANALYSIS,
    payload: {
        result: KatagoResult
    }
}

export interface ActionStateUpdate {
    type: ACTION_STATE_UPDATE,
    payload: {
        state: GameActionState
    }
}

export interface ActionCompleted {
    type: ACTION_COMPLETED,
    payload: {}
}

export interface ActionPending {
    type: ACTION_PENDING,
    payload: {}
}

export interface ActionFailed {
    type: ACTION_FAILED,
    payload: {
        error: string
    }
}

export interface PlaceStoneSuccess {
    type: PLACE_STONE_SUCCESS,
    payload: {
        game: Game
    }
}

export interface StartGameAction {
    type: START_GAME,
    payload: {}
}

export interface PlaceStoneAction {
    type: PLACE_STONE,
    payload: {
        color: Color
        x: number
        y: number
    }
}

export interface StartGameSuccess {
    type: START_GAME_SUCCESS,
    payload: {
        game: Game
    }
}

export interface StopGameSuccess {
    type: STOP_GAME_SUCCESS,
    payload: {}
}

export interface AppendLogAction {
    type: APPEND_LOG,
    payload: {
        log: KatagoLog
    }
}

export type GameAction = StartGameAction | PlaceStoneAction 
    | ActionCompleted | ActionFailed | PlaceStoneSuccess | ActionPending
    | StartGameSuccess | ActionStateUpdate | AppendLogAction
    | SetKatagoAnalysis | Undo | StopGame | StopGameSuccess

export const stopGame = ()
    : ThunkAction<Promise<GameAction>, GameState, null, GameAction> => {
    return (dispatch: ThunkDispatch<GameState, null, GameAction>) => {
        dispatch(actionStateUpdate(GameActionState.PENDING));
        return post<Game>('game/stopGame', {})
            .then((res: AxiosResponse<ApiResponse<Game>>) => {
                dispatch(stopGameSuccess());
            })
            .catch((err: AxiosError<ApiResponse<Game>>) => {
                if (err.response?.data.message) {
                    dispatch(actionFailed(err.response?.data.message));
                } else {
                    dispatch(actionFailed('Login failed'));
                }
                dispatch(actionStateUpdate(GameActionState.FAIL));
            })
            .then(() => actionCompleted());
    };
};

export const startGame = ()
    : ThunkAction<Promise<GameAction>, GameState, null, GameAction> => {
    return (dispatch: ThunkDispatch<GameState, null, GameAction>) => {
        dispatch(actionStateUpdate(GameActionState.PENDING));
        return post<Game>('game/startGame',
            {
                blackHumanPlayer: true,
                whiteHumanPlayer: false,
                komi: 7.5,
                dimension: 19,
                handicap: 0
            })
            .then((res: AxiosResponse<ApiResponse<Game>>) => {
                //dispatch(actionStateUpdate(GameActionState.SUCCESS));
                dispatch(startGameSuccess(res.data.content));
            })
            .catch((err: AxiosError<ApiResponse<Game>>) => {
                if (err.response?.data.message) {
                    dispatch(actionFailed(err.response?.data.message));
                } else {
                    dispatch(actionFailed('Login failed'));
                }
                dispatch(actionStateUpdate(GameActionState.FAIL));
            })
            .then(() => actionCompleted());
    };
};

export const placeStone = (c: string, x: number, y: number)
    : ThunkAction<Promise<GameAction>, GameState, null, GameAction> => {
    return (dispatch: ThunkDispatch<GameState, null, GameAction>) => {
        dispatch(actionStateUpdate(GameActionState.PENDING));
        dispatch(setKatagoAnalysis(EmptyResult));
        return post<Game>('game/placeStone',
            {
                c, x, y
            })
            .then((res: AxiosResponse<ApiResponse<Game>>) => {
                const response = res.data;
                if (response.status !== 200) {
                    dispatch(actionStateUpdate(GameActionState.FAIL));
                } else if (response.content.removedStones.length > 0) {
                    dispatch(actionStateUpdate(GameActionState.SUCCESS_REMOVE_STONE));
                } else {
                    dispatch(actionStateUpdate(GameActionState.SUCCESS));
                }
                dispatch(placeStoneSuccess(response.content));
            })
            .catch((err: AxiosError<ApiResponse<Game>>) => {
                if (err.response?.data.message) {
                    dispatch(actionFailed(err.response?.data.message));
                } else {
                    dispatch(actionFailed('Login failed'));
                }
                dispatch(actionStateUpdate(GameActionState.FAIL));
            })
            .then(() => actionCompleted());
    };
};

export const undo = (): ThunkAction<Promise<GameAction>, GameState, null, GameAction> => {
    return (dispatch: ThunkDispatch<GameState, null, GameAction>) => {
        dispatch(actionStateUpdate(GameActionState.PENDING));
        dispatch(setKatagoAnalysis(EmptyResult));
        return post<Game>('game/undo', {})
            .then((res: AxiosResponse<ApiResponse<Game>>) => {
                const response = res.data;
                if (response.status !== 200) {
                    dispatch(actionStateUpdate(GameActionState.FAIL));
                } else {
                    dispatch(actionStateUpdate(GameActionState.SUCCESS));
                }
                dispatch(placeStoneSuccess(response.content));
            })
            .catch((err: AxiosError<ApiResponse<Game>>) => {
                if (err.response?.data.message) {
                    dispatch(actionFailed(err.response?.data.message));
                } else {
                    dispatch(actionFailed('Login failed'));
                }
                dispatch(actionStateUpdate(GameActionState.FAIL));
            })
            .then(() => actionCompleted());
    };
};

export const startGameSuccess = (game: Game): GameAction => {
    return {
        type: START_GAME_SUCCESS,
        payload: {
            game: game
        }
    };
}

export const actionPending = (): GameAction => {
    return {
        type: ACTION_PENDING,
        payload: {}
    };
}

export const actionCompleted = (): GameAction => {
    return {
        type: ACTION_COMPLETED,
        payload: {}
    };
}

export const actionFailed = (error: string): GameAction => {
    return {
        type: ACTION_FAILED,
        payload: {
            error: error
        }
    };
}

export const actionStateUpdate = (state: GameActionState): GameAction => {
    return {
        type: ACTION_STATE_UPDATE,
        payload: {
            state: state
        }
    };
}

export const placeStoneSuccess = (game: Game): GameAction => {
    return {
        type: PLACE_STONE_SUCCESS,
        payload: {
            game: game
        }
    };
}

export const appendLog = (log: KatagoLog): GameAction => {
    return {
        type: APPEND_LOG,
        payload: {
            log: log
        }
    };
}

export const setKatagoAnalysis = (result: KatagoResult): GameAction => {
    return {
        type: SET_KATAGO_ANALYSIS,
        payload: {
            result: result
        }
    };
}

export const stopGameSuccess = (): GameAction => {
    return {
        type: STOP_GAME_SUCCESS,
        payload: {}
    };
}