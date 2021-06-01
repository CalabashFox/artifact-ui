import { CalibrationBoundary } from "models/Recording";
// TODO no devices: toggle camera settings, clear camera data and restart chrome
interface Point {
    x: number
    y: number
}

export interface Message {
    command: string
    channel: string
    content: any
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
        const host = 'firekeeper.local';
        const port = 8090;
        /**
        this.host = 'https://192.168.31.63:8090';
        this.wshost = 'wss://192.168.31.63:8090/ws?transceiver_type=' + channel + "&id=" + channel;
        */
        this.host = `https://${host}:${port}`;
        this.wshost = `wss://${host}:${port}/ws?transceiver_type=${channel}&id=${channel}`;

        this.codec = 'H264/90000'; //'VP8/90000';
        this.channel = channel;
        this.log('websocket', 'connecting to ' + this.wshost);
        this.websocket = new WebSocket(this.wshost);
        this.websocket.addEventListener('message', (ev) => this.handleWebsocketMessage(this.parseWSMessage(ev)));
        this.websocket.onopen = () => this.log('websocket', 'opened');
        this.websocket.onerror = ev => this.log('websocket', JSON.stringify(ev));
        const bindWebSocketClosed = this.webSocketClosed.bind(this);
        this.websocket.onclose = bindWebSocketClosed;
    }
    
    protected handleWebsocketMessage(message: Message): boolean {
        switch (message.command) {
            case 'answer':
                this.handleAnswer(message.content);
                return true;
            case 'ice-candidate':
                this.handleIceCandidate(message.content);
                return true;
            case 'cancel':
                this.handleCancel();
                return true;
        }
        return false;
    }

    private handleAnswer(message: string): void {

    }

    private handleIceCandidate(iceCandidate: RTCIceCandidateInit): void {
        var candidate = new RTCIceCandidate(iceCandidate);
        try {
            this.peerConnection.addIceCandidate(candidate)
            this.log('pc', 'add ice candidate');
        } catch(err) {
            this.log('pc', 'ice candidate error ' + err);
        }
    }

    private handleCancel(): void {

    }

    protected webSocketClosed(closeEvent: CloseEvent): void {
        this.log('websocket', closeEvent.code + ':' + closeEvent.reason)
    }

    private isMobile(): boolean {
        return /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent);
    }

    protected log(component: string, content: any): void {
        const text = '[' + new Date().toLocaleTimeString() + '][' + this.channel.toUpperCase() + '][' + component + ']:' + content;
        if (this.isMobile()) {
            this.fetch('/logging', JSON.stringify({
                log: text
            }));
        } else {
            console.log(text);
        }        
    }

    protected parseWSMessage(ev: MessageEvent): Message {
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
            }, (error) => console.log(error))
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
                this.log('pc', 'offer request to ' + this.host);
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

    private rtcConfig(): RTCConfiguration {
        return {
            iceServers: [
                {
                    urls: "stun:stun2.1.google.com:19302"
                    //urls: "stun:stun.l.google.com:19302"
                }/*,
                {   
                    username: "hjOh2Vxrf-bcDpi-NjswWnx-MOakJ-j_caG0STSuQq_6ziVSCOSrUpixJvwt8sp1AAAAAGCowJVjYWxhYmFzaGZveA==",
                    credential: "a15b6d0c-bad7-11eb-a468-0242ac140004",
                    urls: [
                        "turn:eu-turn4.xirsys.com:80?transport=udp", 
                        "turn:eu-turn4.xirsys.com:3478?transport=udp",
                        "turn:eu-turn4.xirsys.com:80?transport=tcp",
                        "turn:eu-turn4.xirsys.com:3478?transport=tcp",
                        "turns:eu-turn4.xirsys.com:443?transport=tcp",
                        "turns:eu-turn4.xirsys.com:5349?transport=tcp"
                    ]
                }*/
            ]
        };
    }

    private identifier(): string {
        return this.channel;
    }

    private oppositeIdentifier(): string {
        return this.channel === 'transmitter' ? 'receiver' : this.channel;
    }

    public establishConnection(): Promise<void> {
        try {
            this.log(this.channel, 'connect');
            this.peerConnection = new RTCPeerConnection(this.rtcConfig());
            this.dataChannel = this.peerConnection.createDataChannel('dc.' + this.channel, {
                ordered: true
            });
            this.dataChannel.onerror = this.onError;
            this.dataChannel.onclose = this.onClose; 
            const bindHandleDataChannelMessage = this.handleDataChannelMessage.bind(this);
            this.dataChannel.onmessage = bindHandleDataChannelMessage;
            this.peerConnection.addEventListener('icecandidate', (e: RTCPeerConnectionIceEvent) => {
                this.log('pc', 'ice candidate received');
                this.sendWSMessage({
                    command: 'ice-candidate',
                    channel: this.oppositeIdentifier(),
                    content: e.candidate
                });
            });
            this.peerConnection.onicegatheringstatechange = () => this.log('pc', `iceGatheringState => ${this.peerConnection.iceGatheringState}`);
            this.peerConnection.oniceconnectionstatechange = () => this.log('pc', `iceConnectionState => ${this.peerConnection.iceConnectionState}`);
            this.peerConnection.onsignalingstatechange = () => this.log('pc', `signalingState => ${this.peerConnection.signalingState}`);
            this.peerConnection.onicecandidateerror = (error) => this.log('pc', 'iceCandidateError => ' + error);
            this.peerConnection.onnegotiationneeded = () => this.log('pc', 'negotiationNeeded');
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

    private handleDataChannelMessage(ev: MessageEvent): void {
        this.log('dc', ev.data);
        const message: Message = JSON.parse(ev.data);
        if (message.channel !== this.channel) {
            return;
        }
        switch (message.command) {
            case 'ice-candidate':
                const iceCandidate = JSON.parse(message.content);
                this.setIceCandidate(iceCandidate);
                return;
        }
    }

    private sendWSMessage(message: Message): void {
        this.websocket.send(JSON.stringify(message));
    }

    private sendDCMessage(message: Message): void {
        this.dataChannel.send(JSON.stringify(message));
    }

    private setIceCandidate(iceCandidate: RTCIceCandidateInit): void {
        var candidate = new RTCIceCandidate(iceCandidate);
        try {
            this.peerConnection.addIceCandidate(candidate)
            this.log('pc', 'add ice candidate');
        } catch(err) {
            this.log('pc', 'ice candidate error ' + err);
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
        this.log('dc', 'close');

        if (pc.getTransceivers) {
            pc.getTransceivers().forEach(transceiver => {
                transceiver.stop();
                this.log('stream', 'receiver stop');
            });
        }
        pc.getSenders().forEach(sender => {
            sender.track?.stop();
            obj.log('stream', 'track stop');
        });

        setTimeout(function() {
            pc.close();
            obj.log('pc', 'close');
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