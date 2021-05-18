import React, {useRef, useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {Monitor, MonitorOff, FullScreenTwo } from '@icon-park/react'
import useIcon from "components/hook/icon";
import { useTranslation } from 'react-i18next';
import RTCTransmitter from "utils/rtcTransmitter";

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
        width: '100%'
    },
    button: {
        margin: 0
    }
}));

const RecordingView: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [capturing, setCapturing] = useState<boolean>(false);
    const camera = useRef<HTMLVideoElement>(document.createElement('video'));

    const [transmitter] = useState<RTCTransmitter>(() => new RTCTransmitter(camera, setCapturing));
    const [blocking, setBlocking] = useState<boolean>(false);

    const handleCaptureVideo = () => {
        if (blocking) {
            return;
        }
        try {
            setBlocking(true);
            transmitter.connect();
            setBlocking(false);
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
        transmitter.stop();
        if (stream instanceof MediaStream) {
            stream.getTracks().forEach(track => track.stop());
            camera.current.srcObject = null;
        }
        setCapturing(false);
        setBlocking(false);
    };

    const handleFullscreen = () => {
         camera.current.requestFullscreen().then(() => alert('ok')).catch((err) => alert(err));
    };

    const captureIcon = useIcon(<Monitor title={t('ui.recording.capture')} onClick={() => handleCaptureVideo()}/>, capturing);
    const stopIcon = useIcon(<MonitorOff title={t('ui.recording.stopCapture')} onClick={() => handleStopCapture()}/>, !capturing);
    const fullScreenIcon = useIcon(<FullScreenTwo title={t('ui.recording.fullScreen')} onClick={() => handleFullscreen()}/>, false);

    return <React.Fragment>
        <Grid container>
            <Grid item sm={10} xs={12} className={classes.recordingContainer} >
                <video autoPlay={true} playsInline={true} ref={camera} className={classes.video}></video>
            </Grid>
            <Grid item sm={2} xs={12} className={classes.buttonContainer}>
                <Paper className={classes.button}>{captureIcon}</Paper>
                <Paper className={classes.button}>{stopIcon}</Paper>
                <Paper className={classes.button}>{fullScreenIcon}</Paper>
            </Grid>
        </Grid>
    </React.Fragment>;
}
export default RecordingView;