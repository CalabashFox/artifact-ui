import {
    BROWSE_MOVE,
    RECEIVE_PROGRESS,
    RECEIVE_PROGRESS_FAIL,
    SET,
    SET_MOVE,
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
        displayPolicy: true,
        displayMoves: true
    },
    uploading: false
};

export function sgfReducer(state: SGFState = initialState, action: SGFAction): SGFState {
    switch (action.type) {
        case BROWSE_MOVE:
            return {...state, sgfProperties: {
                    ...state.sgfProperties, currentMove: state.sgfProperties.currentMove + action.payload.diff
                }
            };
        case SET_MOVE:
            return {...state, sgfProperties: {
                    ...state.sgfProperties, currentMove: action.payload.move
                }
            };
        case SET:
            return {
                ...state, analyzedSGF: action.payload.analyzedSGF as AnalyzedSGF,
                sgfProperties: {
                    ...state.sgfProperties, currentMove: 0
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
