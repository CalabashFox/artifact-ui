import {
    RECEIVE_PROGRESS,
    RECEIVE_PROGRESS_FAIL,
    SET,
    SGFAction,
    UPLOAD_FAIL,
    UPLOAD_SUCCESS,
    UPLOADING
} from 'actions/sgf';
import {SGFState} from 'models/StoreState';
import {AnalyzedSGF} from 'models/SGF';

const initialState = {
    analyzedSGF: undefined,
    error: null,
    analysisProgress: undefined,
    sgfProperties: {
        currentMove: 0,
        displayOwnership: true,
        displayPolicy: true
    },
    uploading: false
};

export function sgfReducer(state: SGFState = initialState, action: SGFAction): SGFState {
    switch (action.type) {
        case SET:
            return {
                ...state, analyzedSGF: action.payload.analyzedSGF as AnalyzedSGF,
                sgfProperties: {
                    currentMove: action.payload.analyzedSGF.snapshotList.length - 2,
                    displayOwnership: true,
                    displayPolicy: true
                }
            };
        case UPLOAD_SUCCESS:
            return {
                ...state, analyzedSGF: action.payload.analyzedSGF
            };
        case UPLOAD_FAIL:
            return {
                ...state, error: action.payload.message
            };
        case UPLOADING: {
            return {
                ...state, uploading: action.payload.uploading
            }
        }
        case RECEIVE_PROGRESS:
            return {
                ...state, analysisProgress: action.payload.analysisProgress
            }
        case RECEIVE_PROGRESS_FAIL:
            return {
                ...state, analysisProgress: undefined, error: action.payload.message
            }
        default:
            return state;
    }
}
