import {
    BROWSE_MOVE,
    RECALCULATE_ANALYSIS_DATA,
    RECEIVE_PROGRESS,
    RECEIVE_PROGRESS_FAIL,
    SET,
    SET_MOVE,
    SGFAction,
    UPLOAD_FAIL,
    UPLOAD_SUCCESS,
    UPLOADING,
    SET_IMAGE
} from 'actions/sgf';
import { InitialSGFState } from 'models/SGF';
import {SGFState} from 'models/StoreState';
import SgfUtils from 'utils/sgfUtils';

const initialState = InitialSGFState;

export function sgfReducer(state: SGFState = initialState, action: SGFAction): SGFState {
    switch (action.type) {
        case RECALCULATE_ANALYSIS_DATA:
            return {
                ...state, analyzedSGF: SgfUtils.recalculateSnapshotAnalysisData(state.sgfProperties, state.analyzedSGF!)
            }
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
            let sgf = SgfUtils.calculateSGFAnalysisData(action.payload.analyzedSGF)!;
            sgf = SgfUtils.recalculateSnapshotAnalysisData(state.sgfProperties, sgf);
            sgf = SgfUtils.calculateSGFMatchAnalysisData(state.sgfProperties, sgf);
            return {
                ...state, analyzedSGF: sgf,
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
            };
        }
        case RECEIVE_PROGRESS:
            return {
                ...state, analysisProgress: action.payload.analysisProgress
            };
        case RECEIVE_PROGRESS_FAIL:
            return {
                ...state, analysisProgress: {analyzed: 0, total: 0}, error: action.payload.message
            };
        case SET_IMAGE:
            return {
                ...state, sgfImage: {
                    stones: action.payload.stones
                }
            };
        default:
            return state;
    }
}
