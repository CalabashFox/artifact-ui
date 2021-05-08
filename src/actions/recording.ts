import { ApiResponse, post } from "../api/api"
import { AxiosError, AxiosResponse } from "axios"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { CalibrationBoundary } from "models/Recording"

export const SET_CALIBRATION_BOUNDARIES = "SET_CALIBRATION_BOUNDARIES"
export type SET_CALIBRATION_BOUNDARIES = typeof SET_CALIBRATION_BOUNDARIES

export const SET_CALIBRATION = "SET_CALIBRATION"
export type SET_CALIBRATION = typeof SET_CALIBRATION

export interface SetCalibrationBoundaries {
    type: SET_CALIBRATION_BOUNDARIES,
    payload: {
        calibrationBoundaries: Array<CalibrationBoundary>
    }
}

export interface SetCalibration {
    type: SET_CALIBRATION,
    payload: {
        calibrated: boolean
    }
}

export type RecordingAction = SetCalibration | SetCalibrationBoundaries

export const setCalibrationBoundaries = (calibrationBoundaries: Array<CalibrationBoundary>): RecordingAction => {
    return {
        type: SET_CALIBRATION_BOUNDARIES,
        payload: { calibrationBoundaries }
    }
}

export const setCalibrated = (calibrated: boolean): RecordingAction => {
    return {
        type: SET_CALIBRATION,
        payload: { calibrated }
    };
}
