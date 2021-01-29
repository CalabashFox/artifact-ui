import { ACTION_STATE_UPDATE, APPEND_LOG, GameAction, PLACE_STONE_SUCCESS, SET_KATAGO_ANALYSIS, START_GAME, START_GAME_SUCCESS, STOP_GAME_SUCCESS } from "actions/game";
import { InitialGameState } from "models/Game";
import { GameState } from "models/StoreState";

const initialState = InitialGameState;

export function gameReducer(state: GameState = initialState, action: GameAction): GameState {
    switch (action.type) {
        case START_GAME:
            return {...state};
        case START_GAME_SUCCESS:
            return {...state, game: action.payload.game};
        case PLACE_STONE_SUCCESS:
            return {...state, game: action.payload.game};
        case ACTION_STATE_UPDATE:
            return {...state, actionState: action.payload.state};
        case APPEND_LOG:
            return {...state, logs: state.logs.concat(action.payload.log)}
        case SET_KATAGO_ANALYSIS:
            return {...state, currentResult: action.payload.result};
        case STOP_GAME_SUCCESS:
            return {...state, game: {
                ...state.game, inGame: false
            }};
        default:
            return state;
    }
}
