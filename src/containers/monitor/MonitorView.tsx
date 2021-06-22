import React, {useCallback, useEffect, useRef, useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {Selected, Undo, Check} from '@icon-park/react'
import useIcon from "components/hook/icon";
import { useTranslation } from 'react-i18next';
import { CalibrationBoundary } from "models/Recording";
import { useDispatch } from "react-redux";
import { setCalibrationBoundaries, setCalibrated } from "actions/recording";
import RTCReceiver from "utils/rtcReceiver";
import SGFBoard from "components/SGFBoard";
import useCurrentSnapshot from "components/hook/currentSnapshot";
import { SGFStone } from "models/SGF";
import { KatagoMoveInfo } from "models/Katago";
import { Box } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    buttons: {
        textAlign: 'left'
    },
    video: {
        width: '100%'
    }
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

const MonitorView: React.FC = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { t } = useTranslation();

    const [capturing, setCapturing] = useState<boolean>(false);
    const playback = useRef<HTMLVideoElement>(document.createElement('video'));
    const canvas = useRef<HTMLCanvasElement>(document.createElement('canvas'));

    const [receiver] = useState<RTCReceiver>(() => new RTCReceiver(playback, setCapturing, canvas));
    const [blocking, setBlocking] = useState<boolean>(false);
    const [calibrating, setCalibrating] = useState<boolean>(false);
    const [boundaries, setBoundaries] = useState<Array<CalibrationBoundary>>(() => new Array<CalibrationBoundary>());
    const [timer, setTimer] = useState<number>(0);

    const interval = 50;

    const refreshCalibrationCanvas = useCallback(() => {
        if (!calibrating) {
            return;
        }
        const canvasElem = canvas.current;
        const videoElem = playback.current;
        const ctx = canvasElem.getContext('2d');
    
        canvasElem.width = videoElem.videoWidth;
        canvasElem.height = videoElem.videoHeight;
    
        if (ctx !== null) {
            ctx.drawImage(videoElem, 0, 0, canvasElem.width, canvasElem.height);
        }
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
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        refreshCalibrationCanvas();
    }, [timer]);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (calibrating && capturing) {
            refreshCalibrationCanvas();
        }
    }, [calibrating, capturing, refreshCalibrationCanvas]);

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
        receiver.submitCalibration(orderedBoundaries);
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

    const calibrateIcon = useIcon(<Selected title={t('ui.recording.calibrate')} onClick={() => handleCalibration()}/>, !capturing);
    const confirmCalibrateIcon = useIcon(<Check title={t('ui.recording.confirmCalibrate')} onClick={() => handleConfirmCalibration()}/>, !capturing);
    const undoCalibrateIcon = useIcon(<Undo title={t('ui.recording.undoCalibrate')} onClick={() => handleUndoCalibrate()}/>, !capturing);


    const handleClick = (x: number, y: number) => {
        console.log(x, y);
        return;
    };
    const snapshot = useCurrentSnapshot();
    
    const stones: Array<SGFStone> = [];
    const ownership: Array<number> = [];
    const policy: Array<number> = [];
    const moveInfos: Array<KatagoMoveInfo> = [];

    return <React.Fragment>
        <Grid container>
            <Grid container>
                <Box width={1}>
                    <Paper className={classes.buttons}>
                        {calibrateIcon}
                        {confirmCalibrateIcon}
                        {undoCalibrateIcon}
                    </Paper>
                </Box>
            </Grid>
            <Grid container>
                <Grid item sm={7} xs={12}>
                    <Paper>
                        <SGFBoard click={(x, y) => handleClick(x, y)}
                            grids={19}
                            snapshot={snapshot}
                            currentMove={0}
                            policy={policy} 
                            moveInfos={moveInfos} 
                            stones={stones}
                            ownership={ownership}
                            hoverEffect={false}/>
                    </Paper>
                </Grid>
                <Grid item sm={5} xs={12}>
                    <Paper>
                        <video autoPlay={true} playsInline={true} ref={playback} className={classes.video}
                            /*style={{display: calibrating ? 'none' : 'block' }}*/></video>
                        {/*calibrating && <canvas ref={canvas} onClick={(e) => handleCanvasClick(e)}></canvas>*/}
                        {<canvas ref={canvas} onClick={(e) => handleCanvasClick(e)}></canvas>}
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    </React.Fragment>;
}
export default MonitorView;