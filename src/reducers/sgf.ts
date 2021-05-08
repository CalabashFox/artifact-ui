import {
    RECALCULATE_ANALYSIS_DATA,
    RECEIVE_PROGRESS,
    RECEIVE_PROGRESS_FAIL,
    SET,
    SGFAction,
    UPLOAD_FAIL,
    UPLOAD_SUCCESS,
    UPLOADING,
    SET_IMAGE,
    UPDATE_IMAGE_RESULT,
    SET_SGF_PROPERTIES,
    SET_LIVE_MODE,
    NAVIGATE
} from 'actions/sgf';
import { EmptyResult } from 'models/Katago';
import { InitialSGFState } from 'models/SGF';
import {SGFState} from 'models/StoreState';
import SgfUtils from 'utils/sgfUtils';

const initialState = InitialSGFState;

export function sgfReducer(state: SGFState = initialState, action: SGFAction): SGFState {
    switch (action.type) {
        case SET_LIVE_MODE:
            return {...state, sgfProperties: {
                ...state.sgfProperties, liveMode: action.payload.liveMode
                }
            };
        case SET_SGF_PROPERTIES:
            return {
                ...state, sgfProperties: action.payload.sgfProperties
            };
        case RECALCULATE_ANALYSIS_DATA:
            return {
                ...state, analyzedSGF: SgfUtils.recalculateSnapshotAnalysisData(state.sgfProperties, state.analyzedSGF!)
            }
        case NAVIGATE:
            return {
                ...state, navigation: action.payload.navigation
            };
        case SET:
            let sgf = SgfUtils.calculateSGFAnalysisData(state.sgfProperties, action.payload.analyzedSGF)!;
            sgf = SgfUtils.recalculateSnapshotAnalysisData(state.sgfProperties, sgf);
            sgf = SgfUtils.calculateSGFMatchAnalysisData(state.sgfProperties, sgf);
            const branchNavigation = SgfUtils.renderBranchNavigation(action.payload.analyzedSGF)
            return {
                ...state, analyzedSGF: sgf, hasSGF: true,
                branchNavigation: branchNavigation,
                sgfProperties: {
                    ...state.sgfProperties/*, currentMove: 0*/
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
                    stones: action.payload.sgfImage.stones,
                    katagoResult: EmptyResult
                }
            };
        case UPDATE_IMAGE_RESULT:
            return {
                ...state, sgfImage: {
                    ...state.sgfImage,
                    katagoResult: action.payload.katagoResult
                }
            };
        default:
            return state;
    }
}
