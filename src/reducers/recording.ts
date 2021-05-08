import { RecordingAction, SET_CALIBRATION, SET_CALIBRATION_BOUNDARIES } from "actions/recording";
import { InitialRecordingState } from "models/Recording";
import { RecordingState } from "models/StoreState";

const initialState = InitialRecordingState;

export function recordingReducer(state: RecordingState = initialState, action: RecordingAction): RecordingState {
    switch (action.type) {
        case SET_CALIBRATION_BOUNDARIES:
            return {...state, calibrationBoundaries: action.payload.calibrationBoundaries};        
        case SET_CALIBRATION:
            return {...state, calibrated: action.payload.calibrated};
        default:
            return state;
    }
}
