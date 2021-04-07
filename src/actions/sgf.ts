import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {SGFState} from 'models/StoreState';
import {ApiResponse, get, post, upload} from '../api/api';
import {AxiosError, AxiosResponse} from 'axios';
import {AnalysisProgress, AnalyzedSGF, SGFImage, SGFProperties, SGFStone} from 'models/SGF';
import { KatagoResult } from 'models/Katago';
import { loadingComplete, setLoading, ViewAction } from './view';

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

export const READ_IMAGE = "READ_IMAGE"
export type READ_IMAGE = typeof READ_IMAGE

export const SET_IMAGE = "SET_IMAGE"
export type SET_IMAGE = typeof SET_IMAGE

export const UPDATE_IMAGE_RESULT = "UPDATE_IMAGE_RESULT"
export type UPDATE_IMAGE_RESULT = typeof UPDATE_IMAGE_RESULT

export const SET_SGF_PROPERTIES = "SET_SGF_PROPERTIES"
export type SET_SGF_PROPERTIES = typeof SET_SGF_PROPERTIES

export const TOGGLE_LIVE_MODE = "TOGGLE_LIVE_MODE"
export type TOGGLE_LIVE_MODE = typeof TOGGLE_LIVE_MODE

export const SET_LIVE_MODE = "SET_LIVE_MODE"
export type SET_LIVE_MODE = typeof SET_LIVE_MODE

export const GET_ANALYZED_SGF = "GET_ANALYZED_SGF"
export type GET_ANALYZED_SGF = typeof GET_ANALYZED_SGF

export interface GetAnalyzedSGF {
    type: GET_ANALYZED_SGF,
    payload: {}
}

export interface SetLiveMode {
    type: SET_LIVE_MODE,
    payload: {
        liveMode: boolean
    }
}

export interface ToggleLiveMode {
    type: TOGGLE_LIVE_MODE,
    payload: {
        liveMode: boolean
        snapshot: number
    }
}

export interface SetSGFProperties {
    type: SET_SGF_PROPERTIES,
    payload: {
        sgfProperties: SGFProperties
    }
}

export interface UpdateImageResult {
    type: UPDATE_IMAGE_RESULT,
    payload: {
        katagoResult: KatagoResult
    }
}

export interface SetImage {
    type: SET_IMAGE
    payload: {
        sgfImage: SGFImage
    }
}

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

export type SGFAction = RecalculateAnalysisDataAction | LoadProgressAction 
    | UploadSGFFileAction | UploadingAction | UploadSuccess 
    | UploadFail | ReceiveProgress | ReceiveProgressFail | SetAction 
    | SetMoveAction | BrowseMoveAction | SetImage | UpdateImageResult
    | SetSGFProperties | ToggleLiveMode | SetLiveMode

export const setSGFProperties = (sgfProperties: SGFProperties): SGFAction => {
    return {
        type: SET_SGF_PROPERTIES,
        payload: {
            sgfProperties: sgfProperties
        }
    };
}

type CompositAction = SGFAction | ViewAction;


export const getAnalyzedSGF = ()
    : ThunkAction<Promise<SGFAction>, SGFState, null, SGFAction> => {
    return (dispatch: ThunkDispatch<SGFState, null, SGFAction>) => {
        return post<AnalyzedSGF>('sgf/getAnalyzedSGF', {})
            .then((res: AxiosResponse<ApiResponse<AnalyzedSGF>>) => {
                dispatch(set(res.data.content));
            })
            .catch((err: AxiosError<ApiResponse<AnalyzedSGF>>) => {
                console.log(err);
            }).then();
    };
};    

export const toggleLiveMode = (liveMode: boolean, snapshot: number)
    : ThunkAction<Promise<CompositAction>, SGFState, null, CompositAction> => {
    return (dispatch: ThunkDispatch<SGFState, null, CompositAction>) => {
        dispatch(setLoading(''));
        return post<boolean>('sgf/toggleLiveMode', {
                liveMode: liveMode,
                snapshot: snapshot
            })
            .then((res: AxiosResponse<ApiResponse<boolean>>) => {
                dispatch(setLiveMode(liveMode));
                dispatch(loadingComplete());
            })
            .catch((err: AxiosError<ApiResponse<boolean>>) => {
                console.log(err);
            })
            .then();
    };
};    

export const screenShot = (dataUrl: string)
    : ThunkAction<Promise<SGFAction>, SGFState, null, SGFAction> => {
    return (dispatch: ThunkDispatch<SGFState, null, SGFAction>) => {
        return post<SGFImage>('sgf/screenShot', {
                dataUrl: dataUrl
            })
            .then((res: AxiosResponse<ApiResponse<SGFImage>>) => {
                dispatch(setImage(res.data.content));
            })
            .catch((err: AxiosError<ApiResponse<SGFImage>>) => {
                console.log(err);
            })
            .then();
    };
};    

export const uploadImage = (image: File)
    : ThunkAction<Promise<SGFAction>, SGFState, null, SGFAction> => {
    return (dispatch: ThunkDispatch<SGFState, null, SGFAction>) => {
        return upload<SGFImage>('sgf/uploadImage', image)
            .then((res: AxiosResponse<ApiResponse<SGFImage>>) => {
                dispatch(setImage(res.data.content));
            })
            .catch((err: AxiosError<ApiResponse<SGFImage>>) => {
                console.log(err);
            })
            .then();
    };
};  

export const uploadSGFFile = (file: File)
    : ThunkAction<Promise<void>, SGFState, null, SGFAction> => {
    return (dispatch: ThunkDispatch<SGFState, null, SGFAction>) => {
        dispatch(uploading(true));
        return upload<AnalyzedSGF>('sgf/analysis',file)
            .then((res: AxiosResponse<ApiResponse<AnalyzedSGF>>) => {
                dispatch(uploadSuccess(res.data.content));
            })
            .catch((err: AxiosError<ApiResponse<AnalyzedSGF>>) => {
                if (err.response?.data.message) {
                    dispatch(uploadFail(err.response?.data.message));
                } else {
                    dispatch(uploadFail('Login failed'));
                }
            });
    };
};

export const setLiveMode = (liveMode: boolean): SGFAction => {
    return {
        type: SET_LIVE_MODE,
        payload: {
            liveMode: liveMode
        }
    }
}

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
        return get<AnalysisProgress>('sgf/progress', {})
            .then((res: AxiosResponse<ApiResponse<AnalysisProgress>>) => {
                dispatch(receiveProgress(res.data.content));
            })
            .catch((err: AxiosError<ApiResponse<AnalysisProgress>>) => {
                if (err.response?.data.message) {
                    dispatch(receiveProgressFail(err.response?.data.message));
                } else {
                    dispatch(receiveProgressFail('Could not load progress data'));
                }
            });
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

export const setImage = (sgfImage: SGFImage): SGFAction => {
    return {
        type: SET_IMAGE,
        payload: {
            sgfImage: sgfImage
        }
    }; 
}

export const updateImageResult = (katagoResult: KatagoResult): SGFAction => {
    return {
        type: UPDATE_IMAGE_RESULT,
        payload: {
            katagoResult: katagoResult
        }
    }; 
}

