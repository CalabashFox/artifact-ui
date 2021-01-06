import {KatagoMoveInfo, KatagoResult} from 'models/Katago';

export interface AnalyzedSGF {
    snapShotsAnalyzed: number
    snapshotList: Array<SGFSnapshot>
    annotation: string
    application: string
    date: Date
    event: string
    playerWhite: string
    playerBlack: string
    rankBlack: string
    rankWhite: string
    round: string
    timeLimit: string
    komi: number
    result: string
    place: string
    rules: string
    moves: Array<SGFMove>,
    analysisData: SGFAnalysisData
}

export interface SGFGraphValue {
    label: string
    value: number | null
}

export interface SGFAnalysisData {
    blackWinrate: Array<SGFGraphValue>
    whiteWinrate: Array<SGFGraphValue>
    blackScoreLead: Array<SGFGraphValue>
    whiteScoreLead: Array<SGFGraphValue>
    blackSelfplay: Array<SGFGraphValue>
    whiteSelfplay: Array<SGFGraphValue>
}

export interface SGFMove {
    color: SGFColor
    index: number
    position: string
    x: number
    y: number
}

export interface SGFSnapshot {
    stones: Array<SGFStone>
    index: number
    katagoResults : Array<KatagoResult>
    analysisData: SnapshotAnalysisData
}

export interface SnapshotAnalysisData {
    moves: Array<KatagoMoveInfo>
}

export enum SGFColor {
    BLACK, WHITE
}

export interface AnalysisProgress {
    analyzed: number
    total: number
}

export type SGFStone = string[2];

export interface SGFCoordinate {
    x: number
    y: number
    gtpLocation: string
}

export interface SGFProperties {
    currentMove: number
    displayOwnership: boolean
    displayPolicy: boolean
    displayMoves: boolean
    movePriority: MovePriority
    moveCount: number
    minimumPolicyValue: number
}

export enum MovePriority {
    WINRATE, MEAN, LEAD, PRIOR, ORDER
}