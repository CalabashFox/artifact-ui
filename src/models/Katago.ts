import { Game } from "./Game";

export interface KatagoResult {
    id: string
    isDuringSearch: boolean
    turnNumber: number
    moveInfos: Array<KatagoMoveInfo>
    rootInfo: KatagoRootInfo
    ownership: Array<number>
    policy: Array<number>
}

export interface KatagoRootInfo {
    scoreLead: number
    scoreSelfplay: number
    scoreStdev: number
    utility: number
    visits: number
    winrate: number
}

export interface KatagoMoveInfo {
    move: string
    visits: number
    winrate: number
    scoreMean: number
    scoreLead: number
    scoreSelfplay: number
    scoreStdev: number
    utility: number
    utilityLcb: number
    lcb: number
    prior: number
    order: number
    pvVisits: number
    pv: Array<string>
}

export interface KatagoLog {
    timestamp: string
    text: string
}

export interface KatagoMessage {
    type: string
}

export interface GameStateMessage extends KatagoMessage {
    gameState: Game
}

export interface SGFImageMessage extends KatagoMessage {
    katagoResult: KatagoResult
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