import { CalibrationBoundary } from "models/Recording";
import RTCConnection, { WSMessage } from "./rtcConnection";

export default class RTCTransmitter extends RTCConnection {

    private setCapturing: (state: boolean) => void;
    private transmitterRef: React.MutableRefObject<HTMLVideoElement>;
    private receiverRef: React.MutableRefObject<HTMLVideoElement>;
    private socketReady: boolean;

    public constructor(mobileTestMode: boolean
            , setCapturing: (state: boolean) => void
            , transmitterRef: React.MutableRefObject<HTMLVideoElement>
            , receiverRef: React.MutableRefObject<HTMLVideoElement>) {
        super(mobileTestMode, 'transmitter');
        this.websocket.addEventListener('message', (ev) => this.handleWebsocketMessage(super.parseWSMessage(ev)));
        this.setCapturing = setCapturing;
        this.transmitterRef = transmitterRef;
        this.socketReady = false;
        this.receiverRef = receiverRef;
    }

    private handleWebsocketMessage(message: WSMessage): void {
        switch (message.command) {
            case 'socket-ready':
                this.socketReady = true;
                break;
            case 'video-offer':
                this.handleOffer(JSON.parse(message.content));
                break;
            default:
                this.log('websocket', 'unknown ' + message);
        }
    }

    private handleOffer(offer: RTCSessionDescriptionInit): void {
        this.connect();
    }

    private getConstraints(): MediaStreamConstraints {
        return {
            audio: false,
            video: {
                facingMode: 'user', // environment
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
                frameRate: 24,
            }
        };
    }

    public connect(): void {
        if (!this.socketReady) {
            this.log('websocket', 'socket not ready');
        }
        super.establishConnection()
            .then(() => {
                this.dataChannel.onopen = ev => {
                    this.log('dc', 'open');
                };
                const obj = this;
                const bindedCaptureSuccess = obj.captureSuccess.bind(obj)
                const bindedCaptureError = obj.captureError.bind(obj);
                navigator.mediaDevices
                    .getUserMedia(obj.getConstraints())
                    .then(stream => bindedCaptureSuccess(stream))
                    .catch(err => bindedCaptureError(err));
                    /*
                navigator.mediaDevices.enumerateDevices()
                    .then(devices => {
                        devices
                            .filter(device => device.kind === 'videoinput')
                            .forEach(device => obj.log('media', device.kind + ": " + device.label + " = " + device.deviceId));
                        
                    })
                    .catch(function(err) {
                        console.log(err.name + ": " + err.message);
                        console.log(err);
                    });*/
            })
            .catch(err => console.log(err));
    }
    
    private captureSuccess(stream: MediaStream): void {
        this.log('media', stream.id);
        this.transmitterRef.current.srcObject = stream;
        this.setCapturing(true);
        this.init(stream);
    }

    private captureError(error: Error): void {
        this.log('media', error);
    }

    public submitCalibration(boundaries: Array<CalibrationBoundary>): void {
        fetch(this.host + '/calibration', {
            body: JSON.stringify({
                boundaries: boundaries.map(tuple => [tuple.x, tuple.y])
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
    }

    public init(stream: MediaStream): void {
        const obj = this;
        stream.getTracks().forEach((track) => {
            obj.peerConnection.addTrack(track, stream);
            obj.log('pc', 'add stream track');
        });
        this.peerConnection.addEventListener('track', (evt) => {
            if (evt.track.kind == 'video') {
                obj.receiverRef.current.srcObject = evt.streams[0];
                obj.log('pc', 'receive stream track' + evt.streams[0]);
            }
        });
        super.negotiate();
    }
}