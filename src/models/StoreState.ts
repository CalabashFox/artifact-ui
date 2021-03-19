import {User} from 'models/User';
import {AnalysisProgress, AnalyzedSGF, SGFImage, SGFProperties} from 'models/SGF';
import {Game, GameActionState, GameProperties} from 'models/Game';
import { KatagoLog, KatagoResult } from './Katago';
import { SocketConnectionState } from './view';

export type Nullable<T> = T | null;
export type NullableString = Nullable<string>;

export interface AuthState {
    user: Nullable<User>
    isLoading: boolean
    error: NullableString
    auth: NullableString
}

export interface ViewState {
    infoWidth: number
    screenWidth: number
    tab: number
    loading: boolean
    loadingText: string
    socketConnectionState: SocketConnectionState
}

export interface StoreState {
    sgfState: SGFState
    authState: AuthState
    viewState: ViewState
    gameState: GameState
    katagoState: KatagoState
}

export interface KatagoState {
    katagoResult: KatagoResult
    hasResult: boolean
}

export interface GameState {
    game: Game
    logs: Array<KatagoLog>
    currentResult: KatagoResult
    gameProperties: GameProperties
    actionState: GameActionState
}

export interface SGFState {
    analyzedSGF: AnalyzedSGF
    analysisProgress: AnalysisProgress
    hasSGF: boolean
    error: string
    sgfProperties: SGFProperties
    uploading: boolean
    uploadProgress: number
    sgfImage: SGFImage
}