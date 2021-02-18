import React, {ChangeEvent, ReactElement, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SGFBoard from './SGFBoard';
import {ScreenshotTwo, Camera, ImageFiles, Power} from '@icon-park/react'
import { screenShot, uploadImage } from "actions/sgf";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.primary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
        backgroundColor: theme.palette.primary.main
    },
    board: {
        marginBottom: 0
    },
    leftContainer: {
        alignContent: 'baseline'
    },
    boardGrid: {
        marginBottom: theme.spacing(1)
    },
    icon: {
        color: '#fff',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        '&:hover': {
            cursor: 'pointer'
        }
    },
    canvas: {
        display: 'none'
    },
    video: {
        width: '100%'
    },
    screenshot: {
        width: '100%'
    },
    input: {
        display: 'none',
    },
}));

export default function ImageView(): ReactElement {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const dispatch = useDispatch();
    
    const [screenshotImage, setScreenshotImage] = useState<string>('');
    const [capturing, setCapturing] = useState<boolean>(false);

    const canvas = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    const video = useRef<HTMLVideoElement>(document.createElement('video'));

    const handleClick = (x: number, y: number) => {
        console.log(x, y);
    };

    const stones = sgfState.sgfImage.stones;
    const {policy, ownership, moveInfos} = sgfState.sgfImage.katagoResult;
    
    const blackWinrate = sgfState.sgfImage.katagoResult.rootInfo.winrate;
    const whiteWinrate = 100 - blackWinrate;

    const handleScreenshot = () => {
        canvas.current.width = video.current.videoWidth;
        canvas.current.height = video.current.videoHeight;
        const context = canvas.current.getContext("2d");
        if (context) {
            context.drawImage(video.current, 0, 0);
            // Other browsers will fall back to image/png
            const dataUrl = canvas.current.toDataURL("image/jpeg", 1.0);
            setScreenshotImage(dataUrl);
            dispatch(screenShot(dataUrl));
        }
    };

    const constraints = {
        audio: false,
        video: {
            facingMode: 'environment',
            frameRate: 15
        }
    };

    // http://192.168.0.1:4000
    const handleCaptureVideo = () => {
        try {
            navigator.mediaDevices.enumerateDevices()
            .then(function(devices) {
                devices.forEach(function(device) {
                    console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
                });
            })
            .catch(function(err) {
                console.log(err.name + ": " + err.message);
            });
            navigator.mediaDevices
            .getUserMedia(constraints)
            .then(captureSuccess)
            .catch(captureError);
        } catch(e) {
            
        }
    };

    const handleImageUpload = (event: ChangeEvent) => {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) {
            return;
        }
        const file = input.files[0];
        dispatch(uploadImage(file));
    };

    const handleStopCapture = () => {
        const stream = video.current.srcObject;
        if (stream instanceof MediaStream) {
            stream.getTracks().forEach(track => track.stop());
            video.current.srcObject = null;
        }
        setCapturing(false);
    };

    const captureSuccess = (stream: MediaStream) => {
        video.current.srcObject = stream;
        setCapturing(true);
    }

    function captureError(error: Error) {
        console.error("Error: ", error);
    }

    const iconColor = '#fff';

    return <div>
        <Grid container spacing={1}>
            <Grid container item xs={7} spacing={0} className={classes.leftContainer}>
                <Grid item xs={12} className={classes.boardGrid}>
                    <Paper className={`${classes.paper} ${classes.board}`} >
                    <SGFBoard click={(x, y) => handleClick(x, y)}
                        currentMove={0}
                        policy={policy} 
                        moveInfos={moveInfos} 
                        stones={stones}
                        ownership={ownership}
                        hoverEffect={false}/>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={5}>
                <Paper className={classes.paper}>
                    <input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange={e => handleImageUpload(e)} />
                    <label htmlFor="icon-button-file">
                        {!capturing && <ImageFiles theme="outline" size="24" fill={iconColor} className={classes.icon}/>}
                    </label>
                    {!capturing && <Camera theme="outline" size="24" fill={iconColor} className={classes.icon} onClick={() => handleCaptureVideo()}/>}
                    {capturing && <ScreenshotTwo theme="outline" size="24" fill={iconColor} className={classes.icon} onClick={() => handleScreenshot()}/>}
                    {capturing && <Power theme="outline" size="24" fill={iconColor} className={classes.icon} onClick={() => handleStopCapture()}/>}
                </Paper>            
                black: {blackWinrate.toFixed(2)}%
                white: {whiteWinrate.toFixed(2)}%
                <video autoPlay={true} playsInline={true} ref={video} className={classes.video}></video>
                <img src={screenshotImage} className={classes.screenshot}/>
                <canvas className={classes.canvas} ref={canvas}></canvas>
            </Grid>
            
        </Grid>
    </div>;
}