import {KatagoResult} from 'models/Katago';

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
    moves: Array<SGFMove>
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
    katagoResult? : KatagoResult
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