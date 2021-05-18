import { CalibrationBoundary } from "models/Recording";
import RTCConnection, { Transceiver, WSMessage } from "./rtcConnection";

export default class RTCReceiver extends RTCConnection {

    private receiverRef: React.MutableRefObject<HTMLVideoElement>;
    private setCapturing: (capturing: boolean) => void;
    private canvasRef: React.MutableRefObject<HTMLCanvasElement>;

    public constructor(receiverRef: React.MutableRefObject<HTMLVideoElement>,
        setCapturing: (capturing: boolean) => void, canvasRef: React.MutableRefObject<HTMLCanvasElement>) {
        super(Transceiver.RECEIVER);
        this.websocket.addEventListener('message', (ev) => this.handleWebsocketMessage(super.parseWSMessage(ev)));
        this.receiverRef = receiverRef;
        this.setCapturing = setCapturing;
        this.canvasRef = canvasRef;
    }

    private handleWebsocketMessage(message: WSMessage): void {
        switch (message.command) {
            case 'video-offer':
                this.handleOffer(JSON.parse(message.content));
                break;
            case 'answer':
                this.handleAnswer(message.content);
                break;
            case 'ice-candidate':
                this.handleIceCandidate(message.content);
                break;
            case 'cancel':
                this.handleCancel();
                break;
            default:
                this.log('websocket', 'unknown ' + message);
        }
    }

    private handleOffer(offer: RTCSessionDescriptionInit): void {
        this.connect();
    }

    private handleAnswer(message: string): void {

    }

    private handleIceCandidate(message: string): void {

    }

    private handleCancel(): void {

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
                /*this.peerConnection.addTransceiver('video', {
                    direction: 'recvonly'
                });*/
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
        const obj = this;
        this.peerConnection.addEventListener('track', function(evt) {
            obj.log('pc', 'receive stream track');
            obj.receiverRef.current.srcObject = evt.streams[0];
            /*const track = evt.streams[0].getTracks()[0];
            const capture = new ImageCapture(track);
            setInterval(() => { 
                capture.grabFrame()
                    .then((frame) => {
                        const canvas = obj.canvasRef.current;
                        canvas.width = frame.width;
                        canvas.height = frame.height;
                        const context = canvas.getContext('2d');
                        if (context !== null) {
                            context.drawImage(frame, 0, 0);
                        }
                    });
              }, 1000);*/
            obj.setCapturing(true);
        });
        super.negotiate();
    }

    public stop(): void {
        const pc = this.peerConnection;
        this.dataChannel.close();
        console.log('dc close');

        if (pc.getTransceivers) {
            pc.getTransceivers().forEach(transceiver => {
                transceiver.stop();
                console.log('transceiver stop');
            });
        }
        pc.getSenders().forEach(sender => {
            sender.track?.stop();
            console.log('sender track stop');
        });

        setTimeout(function() {
            pc.close();
            console.log('pc close');
        }, 500);
    }
}