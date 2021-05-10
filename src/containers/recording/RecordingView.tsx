import React, {useCallback, useEffect, useRef, useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {Monitor, MonitorOff, Selected, Undo, Check} from '@icon-park/react'
import useIcon from "components/hook/icon";
import RTCConnection from "utils/rtcConnection";
import { useTranslation } from 'react-i18next';
import { Box, Hidden, Typography } from "@material-ui/core";
import { CalibrationBoundary } from "models/Recording";
import { useDispatch, useSelector } from "react-redux";
import { RecordingState, StoreState } from "models/StoreState";
import { setCalibrationBoundaries, setCalibrated } from "actions/recording";

const useStyles = makeStyles((theme) => ({
    recordingContainer: {
        alignContent: 'baseline',
        order: 1,
        border: '2px solid',
        borderColor: theme.palette.primary.main,
        height: 'auto',
        maxHeight: '90vh',
        overflow: 'auto'
    },
    buttonContainer: {
        order: 2,
        [theme.breakpoints.down('xs')]: {
            order: 0
        },
    },
    video: {
        width: '100%',
        [theme.breakpoints.down('xs')]: {
            width: '350px',
            height: '150px'
        }
    },
}));

const center = (array: Array<CalibrationBoundary>): CalibrationBoundary =>  {
    let minX = -1, maxX = -1, minY = -1, maxY = -1;
    for (let i = 0; i < array.length; i++){
        minX = (array[i].x < minX || minX == -1) ? array[i].x : minX;
        maxX = (array[i].x > maxX || maxX == -1) ? array[i].x : maxX;
        minY = (array[i].y < minY || minY == -1) ? array[i].y : minY;
        maxY = (array[i].y > maxY || maxY == -1) ? array[i].y : maxY;
    }
    return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
}

/* (lt, lb, rt, rb) */
const order = (array: Array<CalibrationBoundary>, center: CalibrationBoundary): Array<CalibrationBoundary> => {
    return [
        array.filter(c => c.x <= center.x && c.y <= center.y)[0],
        array.filter(c => c.x <= center.x && c.y >= center.y)[0],
        array.filter(c => c.x >= center.x && c.y <= center.y)[0],
        array.filter(c => c.x >= center.x && c.y >= center.y)[0]
    ]
}

const isMobile = () => {
    return false;
    //return /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent);
}

const RecordingView: React.FC = () => {
    const recordingState = useSelector<StoreState, RecordingState>(state => state.recordingState);
    const dispatch = useDispatch();
    const classes = useStyles();
    const { t } = useTranslation();

    const [capturing, setCapturing] = useState<boolean>(false);
    const [rtc] = useState(new RTCConnection(isMobile()));
    const [iceGatheringState, setIceGatheringState] = useState<string>('');
    const [blocking, setBlocking] = useState<boolean>(false);
    const [iceConnectionState, setIceConnectionState] = useState<string>('');
    const [signalingState, setSignalingStateState] = useState<string>('');
    const [calibrating, setCalibrating] = useState<boolean>(false);
    const [boundaries, setBoundaries] = useState<Array<CalibrationBoundary>>(new Array<CalibrationBoundary>());
    const camera = useRef<HTMLVideoElement>(document.createElement('video'));
    const playback = useRef<HTMLVideoElement>(document.createElement('video'));
    const canvas = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    const [timer, setTimer] = useState<number>(0);

    const interval = 50;

    const refreshCanvas = () => {
        if (!calibrating) {
            return;
        }
        const canvasElem = canvas.current;
        const videoElem = camera.current;
        const ctx = canvasElem.getContext('2d');
    
        canvasElem.width = videoElem.videoWidth;
        canvasElem.height = videoElem.videoHeight;
    
        ctx?.drawImage(videoElem, 0, 0, canvasElem.width, canvasElem.height);
        boundaries.forEach((boundary) => {
            if (ctx !== null) {
                ctx.beginPath();
                ctx.fillStyle = '#7FDBCA'; // #50FA7B
                ctx.arc(boundary.x, boundary.y, 5, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
        if (calibrating) {
            setTimeout(() => setTimer(timer + 1), interval);
        }
    };// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        refreshCanvas();
    }, [timer]);

    const connectRTC = (stream: MediaStream) => {
        rtc.connect(() => {
            try {
                rtc.initIceGatheringListener(iceGatheringState, setIceGatheringState);
                rtc.initIceConnectionListener(iceConnectionState, setIceConnectionState);
                rtc.initSignalingListener(signalingState, setSignalingStateState);
                rtc.init(stream, playback.current);
            } catch(exception) {
                alert(exception);
            }
        });
    };

    const constraints = {
        audio: false,
        video: {
            facingMode: 'environment',
            //facingMode: 'user',
            //width: 1920,
            //height: 1080,

            width: {
                min: 1280,
                ideal: 3840,
                max: 3840
            },
            height: {
                min: 720,
                ideal: 2160,
                max: 2160
            },
            /*
            width: 1280,
            height: 720,
            */
            frameRate: 5,
        }
    };

    useEffect(() => {
        if (calibrating && capturing) {
            refreshCanvas();
        }
    }, [calibrating, capturing, refreshCanvas]);

    // http://192.168.0.1:4000
    const handleCaptureVideo = () => {
        if (blocking) {
            return;
        }
        setBlocking(true);
        try {
            navigator.mediaDevices.enumerateDevices()
                .then(function(devices) {
                    devices.forEach(function(device) {
                        if (device.kind === 'videoinput') {
                            console.log(device.kind + ": " + device.label + " = " + device.deviceId);
                        }                        
                    });
                    navigator.mediaDevices
                        .getUserMedia(constraints)
                        .then(captureSuccess)
                        .catch(captureError);
                })
                .catch(function(err) {
                    console.log(err.name + ": " + err.message);
                    console.log(err);
                    setBlocking(false);
                });
        } catch(e) {
            console.log(e);
            setBlocking(false);
        }
    };
    
    const handleStopCapture = () => {
        if (blocking) {
            return;
        }
        setBlocking(true);
        const stream = camera.current.srcObject;
        rtc.stop();
        if (stream instanceof MediaStream) {
            stream.getTracks().forEach(track => track.stop());
            camera.current.srcObject = null;
            playback.current.srcObject = null;
        }
        setCalibrating(false);
        setCapturing(false);
        setBlocking(false);
    };

    const handleCalibration = () => {
        if (blocking) {
            return;
        }
        if (calibrating || !capturing) {
            return;
        }
        setBlocking(true);
        dispatch(setCalibrationBoundaries(new Array<CalibrationBoundary>()));
        setBoundaries(new Array<CalibrationBoundary>());
        setCalibrating(true);
        setBlocking(false);
    };

    const handleUndoCalibrate = () => {
        if (blocking) {
            return;
        }
        setBlocking(true);
        dispatch(setCalibrationBoundaries(new Array<CalibrationBoundary>()));
        setBoundaries(new Array<CalibrationBoundary>());
        setCalibrating(true);
        setBlocking(false);
    };

    const handleConfirmCalibration = () => {
        if (blocking) {
            return;
        }
        setBlocking(true);
        const centerCoordinate = center(boundaries);
        const orderedBoundaries = order(boundaries, centerCoordinate);
        if (orderedBoundaries.some(c => c === undefined)) {
            alert('invalid boundaries, reset');
            setBlocking(false);
                setBoundaries(new Array<CalibrationBoundary>());
            return;
        }
        setCalibrating(false);
        setBoundaries(new Array<CalibrationBoundary>());
        dispatch(setCalibrationBoundaries(orderedBoundaries));
        dispatch(setCalibrated(true));
        rtc.submitCalibration(orderedBoundaries);
        setBlocking(false);
    };

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (blocking) {
            return;
        }
        if (boundaries.length === 4) {
            return;
        }
        setBlocking(true);
        const offsetX = canvas.current.offsetLeft;
        const offsetY = canvas.current.offsetTop;
        const x = Math.floor(event.clientX - offsetX);
        const y = Math.floor(event.clientY - offsetY);
        if (x < 0 || y < 0) {
            setBlocking(false);
            return;
        }
        const array = [...boundaries];
        array.push({x, y});
        setBoundaries(array);
        setBlocking(false);
    };

    const captureSuccess = (stream: MediaStream) => {
        camera.current.srcObject = stream;
        setCapturing(true);
        connectRTC(stream);
        setBlocking(false);
    }

    function captureError(error: Error) {
        console.error("Error: ", error);
        setBlocking(false);
    }
        
    const captureIcon = useIcon(<Monitor title={t('ui.recording.capture')} onClick={() => handleCaptureVideo()}/>, capturing);
    const stopIcon = useIcon(<MonitorOff title={t('ui.recording.stopCapture')} onClick={() => handleStopCapture()}/>, !capturing);

    const calibrateIcon = useIcon(<Selected title={t('ui.recording.calibrate')} onClick={() => handleCalibration()}/>, !capturing);
    const confirmCalibrateIcon = useIcon(<Check title={t('ui.recording.confirmCalibrate')} onClick={() => handleConfirmCalibration()}/>, !capturing);
    const undoCalibrateIcon = useIcon(<Undo title={t('ui.recording.undoCalibrate')} onClick={() => handleUndoCalibrate()}/>, !capturing);
    return <React.Fragment>
        <Grid container>
            <Grid item sm={10} xs={12} className={classes.recordingContainer} >
                <video autoPlay={true} playsInline={true} ref={playback} className={classes.video}
                    style={{display: calibrating ? 'none' : 'block' }}></video>
                {calibrating && <canvas ref={canvas} onClick={(e) => handleCanvasClick(e)}></canvas>}
            </Grid>
            <Grid item sm={2} xs={12} className={classes.buttonContainer}>
                <Hidden smUp>
                    <Paper>
                        {captureIcon}
                        {stopIcon}
                        {calibrateIcon}
                        {confirmCalibrateIcon}
                        {undoCalibrateIcon}
                    </Paper>
                </Hidden>
                <Hidden xsDown>
                    <Box pl={0.5} pr={0.5}><Paper>{captureIcon}</Paper></Box>
                    <Box pl={0.5} pr={0.5}><Paper>{stopIcon}</Paper></Box>
                    <Box pl={0.5} pr={0.5}><Paper>{calibrateIcon}</Paper></Box>
                    <Box pl={0.5} pr={0.5}><Paper>{confirmCalibrateIcon}</Paper></Box>
                    <Box pl={0.5} pr={0.5}><Paper>{undoCalibrateIcon}</Paper></Box>
                </Hidden>   
                <Box pl={0.5} pr={0.5}>
                    <Paper>
                        <video autoPlay={true} playsInline={true} ref={camera} className={classes.video}></video>
                    </Paper>
                </Box>
                <Box pl={0.5} pr={0.5}>
                    <Paper>
                        <Typography><span id="test"></span></Typography>
                        <Typography>ICE gathering: {iceGatheringState}</Typography>
                        <Typography>ICE connection: {iceConnectionState}</Typography>
                        <Typography>Signaling: {signalingState}</Typography>
                    </Paper>
                </Box>
            </Grid>
        </Grid>
    </React.Fragment>;
}
export default RecordingView;