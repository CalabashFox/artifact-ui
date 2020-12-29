import {User} from 'models/User';
import {AnalysisProgress, AnalyzedSGF} from 'models/SGF';
import {SGFProperties} from 'models/Katago';

export type Nullable<T> = T | null;
export type NullableString = Nullable<string>;

export interface AuthState {
    user: Nullable<User>
    isLoading: boolean
    error: NullableString
    auth: NullableString
}


export interface StoreState {
    sgfState: SGFState;
    authState: AuthState;
}

export interface SGFState {
    analyzedSGF?: AnalyzedSGF
    analysisProgress?: AnalysisProgress
    error: NullableString
    sgfProperties: SGFProperties
    uploading: boolean
}