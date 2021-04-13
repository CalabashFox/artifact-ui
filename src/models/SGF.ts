import {EmptyResult, KatagoMoveInfo, KatagoResult} from 'models/Katago';
import { SGFState } from './StoreState';

export interface AnalyzedSGF {
    isValid: boolean
    mainBranch: SGFSnapshotBranch
    useAnalysis: boolean
    totalSnapshots: number
    analyzedSnapshots: number
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
    moves: Array<SGFMove>
    analysisData: SGFAnalysisData
}

export interface SGFSnapshotBranch {
    id: number
    level: number
    snapshotList: Array<SGFSnapshot>
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
    moveIndex: number
    level: number
    branchId: number
    branchIndex: number
    nodeName: string
    rootBranchId: number
    katagoResult: KatagoResult | null
    analysisData: SnapshotAnalysisData
    branches: Array<SGFSnapshotBranch>
}

export interface SnapshotAnalysisData {
    moves: Array<KatagoMoveInfo>
}

export enum SGFColor {
    BLACK, WHITE, NONE, OCCUPIED
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
    displayRecommendations: boolean
    displayOwnership: boolean
    displayPolicy: boolean
    displayMoves: boolean
    displayIndex: boolean
    movePriority: MovePriority
    moveCount: number
    minimumPolicyValue: number
    matchRecommended: number
    reportAnalysisWinratesAs: WinrateReport
    minimumOwnershipValue: number
    continuousAnalysis: boolean
    useSound: boolean
    liveMode: boolean
    editMode: boolean
    situationAnalysisMode: boolean
    maxVisits: number
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
        mainBranch: {
            id: 0,
            level: 0,
            snapshotList: Array<SGFSnapshot>()
        },
        useAnalysis: false,
        totalSnapshots: 0,
        analyzedSnapshots: 0,
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
        currentMove: 2,
        displayOwnership: true,
        displayPolicy: true,
        displayMoves: true,
        movePriority: MovePriority.WINRATE,
        moveCount: 5,
        minimumPolicyValue: 0.1,
        matchRecommended: 5,
        reportAnalysisWinratesAs: WinrateReport.SIDETOMOVE,
        minimumOwnershipValue: 0.1,
        continuousAnalysis: false,
        useSound: true,
        liveMode: false,
        editMode: true,
        displayIndex: false,
        displayRecommendations: true,
        maxVisits: 200,
        situationAnalysisMode: false
    },
    uploading: false,
    uploadProgress: 0
};