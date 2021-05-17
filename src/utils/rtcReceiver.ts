import { CalibrationBoundary } from "models/Recording";
import RTCConnection, { WSMessage } from "./rtcConnection";


export default class RTCReceiver extends RTCConnection {

    private receiverRef: React.MutableRefObject<HTMLVideoElement>;

    public constructor(mobileTestMode: boolean, receiverRef: React.MutableRefObject<HTMLVideoElement>) {
        super(mobileTestMode, 'receiver');
        this.websocket.addEventListener('message', (ev) => this.handleWebsocketMessage(super.parseWSMessage(ev)));
        this.receiverRef = receiverRef;
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
        this.log('dc', 'offer received');
        super.establishConnection()
            .then(() => {
                this.dataChannel.onopen = ev => {
                    this.log('dc', 'open');
                    this.dataChannel.send('complete');
                };
                this.init();
                /*this.peerConnection.addTransceiver('video', {
                    direction: 'recvonly'
                });*/
            })     
            .catch(err => console.log(err));
    }

    private handleAnswer(message: string): void {

    }

    private handleIceCandidate(message: string): void {

    }

    private handleCancel(): void {

    }

    public connect(): void {
        /*
        this.peerConnection.addTransceiver('video', {
            direction: 'recvonly'
        });*/
        this.log('dc', 'connect');
        super.establishConnection()
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
            obj.log('pc', 'receive stream track' + evt.streams[0]);
            obj.receiverRef.current.srcObject = evt.streams[0];
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