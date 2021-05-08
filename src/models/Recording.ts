
export interface CalibrationBoundary {
    x: number
    y: number
}

export const InitialRecordingState = {
    calibrated: false,
    calibrationBoundaries: new Array<CalibrationBoundary>()
}