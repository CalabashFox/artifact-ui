import { CalibrationBoundary } from "models/Recording";
import RTCConnection, { Transceiver, Message } from "./rtcConnection";

export default class RTCReceiver extends RTCConnection {

    private receiverRef: React.MutableRefObject<HTMLVideoElement>;
    private setCapturing: (capturing: boolean) => void;
    private canvasRef: React.MutableRefObject<HTMLCanvasElement>;
    private timer: NodeJS.Timer;

    public constructor(receiverRef: React.MutableRefObject<HTMLVideoElement>,
        setCapturing: (capturing: boolean) => void, canvasRef: React.MutableRefObject<HTMLCanvasElement>) {
        super(Transceiver.RECEIVER);
        this.receiverRef = receiverRef;
        this.setCapturing = setCapturing;
        this.canvasRef = canvasRef;
    }

    protected webSocketClosed(closeEvent: CloseEvent): void {
        super.webSocketClosed(closeEvent);
        this.clearTimer();
    }

    protected handleWebsocketMessage(message: Message): boolean {
        if (super.handleWebsocketMessage(message)) {
            return true;
        }
        switch (message.command) {
            case 'video-offer':
                this.handleOffer(JSON.parse(message.content));
                break;
            default:
                this.log('websocket', 'unknown ' + message);
        }
        return true;
    }

    private handleOffer(offer: RTCSessionDescriptionInit): void {
        this.connect();
    }

    public connect(): void {
        /*
        ;*/
        this.log('dc', 'connect');
        super.establishConnection()
            .then(() => this.peerConnection.addTransceiver('video', {
                direction: 'recvonly'
            }))
            .then(() => {
                this.dataChannel.onopen = ev => {
                    this.log('dc', 'open');
                    //this.dataChannel.send('complete');
                };
                this.init();
            })     
            .catch(err => console.log(err));
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

    public init(): void {
        this.log('pc', 'init');
        const bindStream = this.bindStream.bind(this);
        this.peerConnection.addEventListener('track', evt => bindStream(evt.streams[0]));
        super.negotiate();
    }

    private bindStream(stream: MediaStream): void {
        this.log('pc', 'receive stream track');
        this.receiverRef.current.addEventListener('loadeddata', (evt) => {
            console.log('data loaded: ', evt);
        });
        this.receiverRef.current.srcObject = stream;
        this.receiverRef.current.srcObject
        console.log(this.receiverRef.current.videoWidth + 'x' + this.receiverRef.current.videoHeight);
        this.setCapturing(true);
        //this.debug(stream);
    }

    public debug(stream: MediaStream): void {
        const obj = this;
        const track = stream.getTracks()[0];
        const capture = new ImageCapture(track);
        this.timer = setInterval(() => { 
            capture.grabFrame()
                .then((frame) => {
                    if (frame === undefined) {
                        return;
                    }
                    const canvas = obj.canvasRef.current;
                    canvas.width = frame.width;
                    canvas.height = frame.height;
                    const context = canvas.getContext('2d');
                    if (context !== null) {
                        context.drawImage(frame, 0, 0);
                    }
                });
          }, 1000);
    }

    private clearTimer(): void {
        if (this.timer !== null) {
            clearInterval(this.timer);
        }
    }

    public stop(): void {
        super.stop();
        this.clearTimer();
    }
}