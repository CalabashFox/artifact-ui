import { ApiResponse, post } from "../api/api"
import { AxiosError, AxiosResponse } from "axios"
import { Color, Game } from "models/Game"
import { GameState } from "models/StoreState"
import { ThunkAction, ThunkDispatch } from "redux-thunk"

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

export type GameAction = StartGameAction | PlaceStoneAction | ActionCompleted | ActionFailed | PlaceStoneSuccess | ActionPending

export const startGame = ()
    : ThunkAction<Promise<GameAction>, GameState, null, GameAction> => {
    return (dispatch: ThunkDispatch<GameState, null, GameAction>) => {
        dispatch(actionPending());
        return post<Game>('game/startGame',
            {
                blackHumanPlayer: true,
                whiteHumanPlayer: false,
                komi: 7.5,
                dimension: 19,
                handicap: 0
            })
            .then((res: AxiosResponse<ApiResponse<Game>>) => {
                //dispatch(PlaceStoneSuccess(res.data.entity));
            })
            .catch((err: AxiosError<ApiResponse<Game>>) => {
                if (err.response?.data.message) {
                    dispatch(actionFailed(err.response?.data.message));
                } else {
                    dispatch(actionFailed('Login failed'));
                }
            })
            .then(() => actionCompleted());
    };
};

export const placeStone = (c: string, x: number, y: number)
    : ThunkAction<Promise<GameAction>, GameState, null, GameAction> => {
    return (dispatch: ThunkDispatch<GameState, null, GameAction>) => {
        dispatch(actionPending());
        return post<Game>('game/placeStone',
            {
                c, x, y
            })
            .then((res: AxiosResponse<ApiResponse<Game>>) => {
                console.log(res);
                dispatch(PlaceStoneSuccess(res.data.content));
            })
            .catch((err: AxiosError<ApiResponse<Game>>) => {
                if (err.response?.data.message) {
                    dispatch(actionFailed(err.response?.data.message));
                } else {
                    dispatch(actionFailed('Login failed'));
                }
            })
            .then(() => actionCompleted());
    };
};

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

export const PlaceStoneSuccess = (game: Game): GameAction => {
    return {
        type: PLACE_STONE_SUCCESS,
        payload: {
            game: game
        }
    };
}