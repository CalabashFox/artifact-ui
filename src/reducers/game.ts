import { GameAction, PLACE_STONE_SUCCESS, START_GAME } from "actions/game";
import { InitialGameState } from "models/Game";
import { GameState } from "models/StoreState";

const initialState = InitialGameState;

export function gameReducer(state: GameState = initialState, action: GameAction): GameState {
    switch (action.type) {
        case START_GAME:
            return {...state};
        case PLACE_STONE_SUCCESS:
            console.log(action.payload.game);
            return {...state, game: action.payload.game};
        default:
            return state;
    }
}
