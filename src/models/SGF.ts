import {EmptyResult, KatagoMoveInfo, KatagoResult} from 'models/Katago';
import { SGFState } from './StoreState';

export interface AnalyzedSGF {
    isValid: boolean
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
    handicap: number
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

export interface SGFStackGraphValue {
    label: string
    player: number
    ai: number
    diff: number
}

export interface SGFAnalysisData {
    blackMatchAnalysis: Array<boolean>
    whiteMatchAnalysis: Array<boolean>
    blackMatch: number
    whiteMatch: number
    blackWinrate: Array<SGFGraphValue>
    whiteWinrate: Array<SGFGraphValue>
    blackScoreLead: Array<SGFGraphValue>
    whiteScoreLead: Array<SGFGraphValue>
    blackSelfplay: Array<SGFGraphValue>
    whiteSelfplay: Array<SGFGraphValue>
    blackWinrateAnalysis: Array<SGFStackGraphValue>
    whiteWinrateAnalysis: Array<SGFStackGraphValue>
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
    BLACK, WHITE, NONE
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
    topMatch: number
    reportAnalysisWinratesAs: WinrateReport
    minimumOwnershipValue: number
    continuousAnalysis: boolean
    useSound: boolean
    liveMode: boolean
}

export enum WinrateReport {
    BLACK, WHITE, SIDETOMOVE
}

export interface SGFImage {
    stones: Array<SGFStone>
    katagoResult: KatagoResult
}

export enum MovePriority {
    WINRATE, MEAN, LEAD, PRIOR, ORDER
}

export const InitialSGFState: SGFState = {
    hasSGF: false,
    sgfImage: {
        stones: new Array<SGFStone>(),
        katagoResult: EmptyResult
    },
    analyzedSGF: {
        isValid: false,
        snapShotsAnalyzed: 0,
        snapshotList: new Array<SGFSnapshot>(),
        annotation: '',
        application: '',
        date: new Date(),
        event: '',
        playerWhite: '',
        playerBlack: '',
        rankBlack: '',
        rankWhite: '',
        round: '',
        timeLimit: '',
        komi: 0,
        handicap: 0,
        result: '',
        place: '',
        rules: '',
        moves: new Array<SGFMove>(),
        analysisData: { 
            blackMatchAnalysis: new Array<boolean>(),
            whiteMatchAnalysis: new Array<boolean>(),
            blackMatch: 0,
            whiteMatch: 0,
            blackWinrate: new Array<SGFGraphValue>(),
            whiteWinrate: new Array<SGFGraphValue>(),
            blackScoreLead: new Array<SGFGraphValue>(),
            whiteScoreLead: new Array<SGFGraphValue>(),
            blackSelfplay: new Array<SGFGraphValue>(),
            whiteSelfplay: new Array<SGFGraphValue>(),
            blackWinrateAnalysis: new Array<SGFStackGraphValue>(),
            whiteWinrateAnalysis: new Array<SGFStackGraphValue>()
        }
    },
    analysisProgress: {
        analyzed: 0,
        total: 0
    },
    error: '',
    sgfProperties: {
        currentMove: 0,
        displayOwnership: true,
        displayPolicy: true,
        displayMoves: true,
        movePriority: MovePriority.WINRATE,
        moveCount: 5,
        minimumPolicyValue: 0.1,
        topMatch: 5,
        reportAnalysisWinratesAs: WinrateReport.SIDETOMOVE,
        minimumOwnershipValue: 0.1,
        continuousAnalysis: false,
        useSound: true,
        liveMode: false
    },
    uploading: false,
    uploadProgress: 0
};