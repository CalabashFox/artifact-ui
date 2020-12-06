export const LOAD_GAME_LIST = 'LOAD_GAME_LIST';
export type LOAD_GAME_LIST = typeof LOAD_GAME_LIST;

export const LOAD_GAME = 'LOAD_GAME';
export type LOAD_GAME = typeof LOAD_GAME;

export interface LoadGameListAction {
    type: LOAD_GAME_LIST;
}

export interface LoadGameAction {
    type: LOAD_GAME;
    payload: {
        matchId: number;
    };
}

export type GameAction = LoadGameListAction | LoadGameAction;

export const loadGameList = (): LoadGameListAction => ({
    type: LOAD_GAME_LIST
});

export const loadGame = (matchId: number): LoadGameAction => ({
    type: LOAD_GAME,
    payload: {
        matchId
    }
});
