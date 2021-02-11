import {User} from 'models/User';
import {AnalysisProgress, AnalyzedSGF, SGFImage, SGFProperties} from 'models/SGF';
import {Game, GameActionState, GameProperties} from 'models/Game';
import { KatagoLog, KatagoResult } from './Katago';

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
}

export interface StoreState {
    sgfState: SGFState
    authState: AuthState
    viewState: ViewState
    gameState: GameState
}

export interface GameState {
    game: Game
    logs: Array<KatagoLog>
    actionState: GameActionState
    currentResult: KatagoResult
    gameProperties: GameProperties
}

export interface SGFState {
    analyzedSGF: AnalyzedSGF
    analysisProgress: AnalysisProgress
    error: string
    sgfProperties: SGFProperties
    uploading: boolean
    sgfImage: SGFImage
}