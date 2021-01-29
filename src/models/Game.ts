import SocketHandler from "utils/socketHandler";
import { KatagoLog, KatagoMoveInfo, KatagoResult } from "./Katago";
import { SGFMove, SGFStone } from "./SGF";

export interface Game {
    black: Player
    white: Player
    inGame: boolean
    currentMove: number
    moves: Array<SGFMove>
    stones: Array<SGFStone>
    removedStones: Array<SGFMove>
}

export interface Player {
    color: Color
    isHuman: boolean
    turn: boolean
    time: number
    statList: Array<MoveStat>
}

export interface MoveStat {
    index: number
    winrate: number
    scoreLead: number
    selfplay: number
    match: number
}

export enum Color {
    BLACK, WHITE
}

export interface GameProperties {

}

export interface SocketState {
    connected: boolean
}

export enum GameActionState {
    PENDING, NONE, FAIL, SUCCESS, SUCCESS_REMOVE_STONE
}

export const EmptyResult: KatagoResult = {
    id: '',
        isDuringSearch: false,
        turnNumber: 0,
        moveInfos: new Array<KatagoMoveInfo>(),
        rootInfo: {
            scoreLead: 0,
            scoreSelfplay: 0,
            scoreStdev: 0,
            utility: 0,
            visits: 0,
            winrate: 0
        },
        ownership: new Array<number>(),
        policy: new Array<number>()
}

export const InitialGameState = {
    game: {
        black: {
            color: Color.BLACK,
            isHuman: true,
            turn: false,
            time: 0,
            statList: new Array<MoveStat>()
        },
        white: {
            color: Color.BLACK,
            isHuman: true,
            turn: false,
            time: 0,
            statList: new Array<MoveStat>()
        },
        inGame: false,
        currentMove: 0,
        moves: new Array<SGFMove>(),
        stones: new Array<SGFStone>(),
        removedStones: new Array<SGFMove>()
    },
    actionState: GameActionState.NONE,
    logs: new Array<KatagoLog>(),
    currentResult: EmptyResult,
    gameProperties: {

    }
}