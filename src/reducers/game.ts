import {GameAction, LOAD_GAME, LOAD_GAME_LIST} from 'actions/game';
import {GameState} from 'models/StoreState';

const initialState = {
    gameList: [],
    game: null
};

export function gameReducer(state: GameState = initialState, action: GameAction): GameState {
    switch (action.type) {
        case LOAD_GAME_LIST:
            return {
                ...state
            };
        case LOAD_GAME:
            return {
                ...state, game: null
            };
        default:
            return state;
    }
}
