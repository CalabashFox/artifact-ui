import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {SGFState} from 'models/StoreState';
import {ApiResponse, post} from '../api/api';
import {AxiosError, AxiosResponse} from 'axios';
import {AnalysisProgress, AnalyzedSGF} from 'models/SGF';

export const UPLOAD_SGF_FILE = 'UPLOAD_SGF_FILE'
export type UPLOAD_SGF_FILE = typeof UPLOAD_SGF_FILE

export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS'
export type UPLOAD_SUCCESS = typeof UPLOAD_SUCCESS

export const UPLOAD_FAIL = 'UPLOAD_FAIL';
export type UPLOAD_FAIL = typeof UPLOAD_FAIL;

export const LOAD_PROGRESS = 'LOAD_PROGRESS'
export type LOAD_PROGRESS = typeof LOAD_PROGRESS

export const RECEIVE_PROGRESS = 'RECEIVE_PROGRESS'
export type RECEIVE_PROGRESS = typeof RECEIVE_PROGRESS

export const RECEIVE_PROGRESS_FAIL = 'RECEIVE_PROGRESS_FAIL'
export type RECEIVE_PROGRESS_FAIL = typeof RECEIVE_PROGRESS_FAIL

export const UPLOADING = 'UPLOADING';
export type UPLOADING = typeof UPLOADING;

export const SET = 'SET';
export type SET = typeof SET;

export const SET_MOVE = 'SET_MOVE';
export type SET_MOVE = typeof SET_MOVE;

export const BROWSE_MOVE = 'BROWSE_MOVE';
export type BROWSE_MOVE = typeof BROWSE_MOVE;

export const RECALCULATE_ANALYSIS_DATA = 'RECALCULATE_ANALYSIS_DATA';
export type RECALCULATE_ANALYSIS_DATA = typeof RECALCULATE_ANALYSIS_DATA;

export interface RecalculateAnalysisDataAction {
    type: RECALCULATE_ANALYSIS_DATA,
    payload: {

    }
}

export interface SetAction {
    type: SET,
    payload: {
        analyzedSGF: AnalyzedSGF
    }
}

export interface BrowseMoveAction {
    type: BROWSE_MOVE,
    payload: {
        diff: number
    }
}

export interface SetMoveAction {
    type: SET_MOVE,
    payload: {
        move: number
    }
}

export interface UploadSGFFileAction {
    type: UPLOAD_SGF_FILE;
    payload: {

    }
}

export interface UploadSuccess {
    type: UPLOAD_SUCCESS
    payload: {
        analyzedSGF: AnalyzedSGF
    }
}

export interface UploadFail {
    type: UPLOAD_FAIL
    payload: {
        message: string;
    }
}

export interface LoadProgressAction {
    type: LOAD_PROGRESS;
    payload: {

    }
}

export interface ReceiveProgress {
    type: RECEIVE_PROGRESS;
    payload: {
        analysisProgress: AnalysisProgress
    }
}

export interface ReceiveProgressFail {
    type: RECEIVE_PROGRESS_FAIL;
    payload: {
        message: string;
    }
}

export interface UploadingAction {
    type: UPLOADING,
    payload: {
        uploading: boolean
    }
}

export type SGFAction = RecalculateAnalysisDataAction | LoadProgressAction | UploadSGFFileAction | UploadingAction | UploadSuccess | UploadFail | ReceiveProgress | ReceiveProgressFail | SetAction | SetMoveAction | BrowseMoveAction


export const uploadSGFFile = (file: string)
    : ThunkAction<Promise<void>, SGFState, null, SGFAction> => {
    return (dispatch: ThunkDispatch<SGFState, null, SGFAction>) => {
        dispatch(uploading(true));
        return post<AnalyzedSGF>('api/sgf/analysis',
            {
                file
            })
            .then((res: AxiosResponse<ApiResponse<AnalyzedSGF>>) => {
                dispatch(uploadSuccess(res.data.content));
            })
            .catch((err: AxiosError<ApiResponse<AnalyzedSGF>>) => {
                if (err.response?.data.message) {
                    dispatch(uploadFail(err.response?.data.message));
                } else {
                    dispatch(uploadFail('Login failed'));
                }
            })
            .then(() => uploadComplete(dispatch));
    };
};

export const uploading = (uploading: boolean): SGFAction => {
    return {
        type: UPLOADING,
        payload: {
            uploading
        }
    }
}

function uploadComplete(dispatch: ThunkDispatch<SGFState, null, SGFAction>) {
    dispatch(uploading(false));
}

export const uploadSuccess = (analyzedSGF: AnalyzedSGF): SGFAction => {
    return {
        type: UPLOAD_SUCCESS,
        payload: {
            analyzedSGF
        }
    };
}

export const uploadFail = (message: string): SGFAction => {
    return {
        type: UPLOAD_FAIL,
        payload: {
            message
        }
    };
}

export const loadProgress = () : ThunkAction<Promise<void>, SGFState, null, SGFAction> => {
    return (dispatch: ThunkDispatch<SGFState, null, SGFAction>) => {
        return post<AnalysisProgress>('api/sgf/progress', {})
            .then((res: AxiosResponse<ApiResponse<AnalysisProgress>>) => {
                dispatch(receiveProgress(res.data.content));
            })
            .catch((err: AxiosError<ApiResponse<AnalysisProgress>>) => {
                if (err.response?.data.message) {
                    dispatch(receiveProgressFail(err.response?.data.message));
                } else {
                    dispatch(receiveProgressFail('Could not load progress data'));
                }
            })
            .then(() => uploadComplete(dispatch));
    };
}

export const set = (analyzedSGF: AnalyzedSGF): SGFAction => {
    return {
        type: SET,
        payload: {
            analyzedSGF
        }
    };
}

export const browseMove = (diff: number): SGFAction => {
    return {
        type: BROWSE_MOVE,
        payload: {
            diff
        }
    };
}


export const setMove = (move: number): SGFAction => {
    return {
        type: SET_MOVE,
        payload: {
            move
        }
    };
}

export const receiveProgress = (analysisProgress: AnalysisProgress): SGFAction => {
    return {
        type: RECEIVE_PROGRESS,
        payload: {
            analysisProgress
        }
    };
}

export const recalculateAnalysisData = (): SGFAction => {
    return {
        type: RECALCULATE_ANALYSIS_DATA,
        payload: {

        }
    };
}

export const receiveProgressFail = (message: string): SGFAction => {
    return {
        type: RECEIVE_PROGRESS_FAIL,
        payload: {
            message
        }
    };
}
