import { CalibrationBoundary } from "models/Recording";
// TODO no devices: toggle camera settings, clear camera data and restart chrome
interface Point {
    x: number
    y: number
}

export interface WSMessage {
    command: string
    content: string
}

export enum Transceiver {
    TRANSMITTER, RECEIVER
}

export default class RTCConnection {

    protected host: string;
    protected wshost: string;
    protected peerConnection!: RTCPeerConnection;
    protected dataChannel!: RTCDataChannel;
    protected codec: string;
    protected channel: string;
    protected websocket: WebSocket;

    public constructor(transceiver: Transceiver) {
        const channel = transceiver == Transceiver.TRANSMITTER ? 'transmitter' : 'receiver';
        if (transceiver == Transceiver.TRANSMITTER) {
            //this.host = 'https://192.168.31.63:8090';
            //this.wshost = 'wss://192.168.31.63:8090/ws?transceiver_type=' + channel + "&id=" + channel;
            this.host = 'https://localhost:8090';
            this.wshost = 'wss://localhost:8090/ws?transceiver_type=' + channel + "&id=" + channel;
            //this.host = 'https://firekeeper.local:8090';
        } else {
            this.host = 'https://localhost:8090';
            this.wshost = 'wss://localhost:8090/ws?transceiver_type=' + channel + "&id=" + channel;
        }
        this.codec = 'H264/90000';
        //this.codec = 'VP8/90000';
        this.channel = channel;
        this.log('websocket', 'created');
        this.websocket = new WebSocket(this.wshost);
        this.websocket.addEventListener('open', () => this.log('websocket', 'opened'));
        this.websocket.addEventListener('error', (error) => this.log('websocket', error));
    }

    protected log(component: string, content: any): void {
        console.log('[' + new Date().toLocaleTimeString() + '][' + this.channel.toUpperCase() + '][' + component + ']:' + content);
    }

    protected parseWSMessage(ev: MessageEvent): WSMessage {
        this.log('websocket', ' <= ' + ev.data);
        return JSON.parse(ev.data);
    }

    protected negotiate(): void {
        const pc = this.peerConnection;
        const obj = this;
        this.log('pc', 'create offer');
        pc.createOffer()
            .then(offer => {
                this.log('pc', 'set local description');
                return pc.setLocalDescription(offer);
            })
            .then(() => {
                return new Promise<void>((resolve) => {
                    if (pc.iceGatheringState === 'complete') {
                        resolve();
                    } else {
                        const checkState = () => {
                            if (pc.iceGatheringState === 'complete') {
                                pc.removeEventListener('icegatheringstatechange', checkState);
                                resolve();
                            }
                        };
                        pc.addEventListener('icegatheringstatechange', checkState);
                    }
                });
            })
            .then(() => {
                this.log('pc', 'offer request');
                const offer = pc.localDescription;
                if (offer === null) {
                    return Promise.reject('offer null');
                }
                return this.fetch('/offer', JSON.stringify({
                    id: obj.channel,
                    sdp: obj.sdpFilterCodec('video', this.codec, offer.sdp),
                    type: offer.type,
                    video_transform: 'bgr',
                    transceiver_type: obj.channel
                }));
            })
            .then(response => response.json())
            .then(answer => {
                this.log('pc', 'receive answer');
                return pc.setRemoteDescription(answer);
            })
            .catch(error => this.log('pc', error));
    }

    protected id(): string {
        return Math.random().toString(36).substring(7);
    }

    protected fetch(action: string, body: string): Promise<Response> {
        return fetch(this.host + action, {
            body: body,
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
    }

    public establishConnection(): Promise<void> {
        try {
            const configuration: RTCConfiguration = {
                iceServers: [
                    {
                        urls: "stun:stun2.1.google.com:19302"
                        //urls: "stun:stun.l.google.com:19302"
                    }
                ],
            };
            this.log(this.channel, 'connect');
            this.peerConnection = new RTCPeerConnection(configuration);
            this.dataChannel = this.peerConnection.createDataChannel('dc.' + this.channel, {
                ordered: true
            });
            this.dataChannel.onerror = this.onError;
            this.dataChannel.onclose = this.onClose;
            this.dataChannel.addEventListener('message', (ev) => {
                this.log('dc', ev.data);
            });
            this.peerConnection.addEventListener('icecandidate', (e: RTCPeerConnectionIceEvent) => {
                //console.log(e.candidate);
                //pc.addIceCandidate(e.candidate!);
            });
            this.peerConnection.addEventListener('icegatheringstatechange', () => {
                this.log('pc', 'iceGatheringState => ' + this.peerConnection.iceGatheringState);
            });

            this.peerConnection.addEventListener('iceconnectionstatechange', () => {
                this.log('pc', 'iceConnectionState => ' + this.peerConnection.iceConnectionState);
            });

            this.peerConnection.addEventListener('signalingstatechange', () => {
                this.log('pc', 'signalingState => ' + this.peerConnection.signalingState);
            });
            return Promise.resolve();
        } catch (exception) {
            this.log('pc', exception);
            const test = document.getElementById('test');
            if (test !== null) {
                test.innerHTML = exception;
            }
            return Promise.reject(exception);
        }
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

    public stop(): void {
        const obj = this;
        const pc = this.peerConnection;
        this.dataChannel.close();
        console.log(this.channel + '.dc close');

        if (pc.getTransceivers) {
            pc.getTransceivers().forEach(transceiver => {
                transceiver.stop();
                console.log(this.channel + '.transceiver stop');
            });
        }
        pc.getSenders().forEach(sender => {
            sender.track?.stop();
            console.log(this.channel + '.sender track stop');
        });

        setTimeout(function() {
            pc.close();
            console.log(obj.channel + '.pc close');
        }, 500);
    }

    protected onClose(): void {
        console.log(this.channel + '.datachannel closed');
    }

    protected onError(error: RTCErrorEvent): void {
        console.log(this.channel + '.datachannel error', error);
    }

    protected sdpFilterCodec(kind: string, codec: string, realSdp: string): string {
        var allowed = [];
        var rtxRegex = new RegExp('a=fmtp:(\\d+) apt=(\\d+)\r$');
        var codecRegex = new RegExp('a=rtpmap:([0-9]+) ' + this.escapeRegExp(codec));
        var videoRegex = new RegExp('(m=' + kind + ' .*?)( ([0-9]+))*\\s*$');
        
        var lines = realSdp.split('\n');
    
        var isKind = false;
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('m=' + kind + ' ')) {
                isKind = true;
            } else if (lines[i].startsWith('m=')) {
                isKind = false;
            }
    
            if (isKind) {
                var match = lines[i].match(codecRegex);
                if (match) {
                    allowed.push(parseInt(match[1]));
                }
    
                match = lines[i].match(rtxRegex);
                if (match && allowed.includes(parseInt(match[2]))) {
                    allowed.push(parseInt(match[1]));
                }
            }
        }
    
        var skipRegex = 'a=(fmtp|rtcp-fb|rtpmap):([0-9]+)';
        var sdp = '';
    
        isKind = false;
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('m=' + kind + ' ')) {
                isKind = true;
            } else if (lines[i].startsWith('m=')) {
                isKind = false;
            }
    
            if (isKind) {
                var skipMatch = lines[i].match(skipRegex);
                if (skipMatch && !allowed.includes(parseInt(skipMatch[2]))) {
                    continue;
                } else if (lines[i].match(videoRegex)) {
                    sdp += lines[i].replace(videoRegex, '$1 ' + allowed.join(' ')) + '\n';
                } else {
                    sdp += lines[i] + '\n';
                }
            } else {
                sdp += lines[i] + '\n';
            }
        }
    
        return sdp;
    }

    private escapeRegExp(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
}