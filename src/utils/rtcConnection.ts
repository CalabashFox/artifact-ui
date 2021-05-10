import { CalibrationBoundary } from "models/Recording";

interface Point {
    x: number
    y: number
}

export default class RTCConnection {

    private host: string;
    private peerConnection!: RTCPeerConnection;
    private dataChannel!: RTCDataChannel;
    private mobileTestMode: boolean;
    private codec: string;

    public constructor(mobileTestMode: boolean) {
        if (mobileTestMode) {
            this.host = 'https://192.168.31.63:8090';
            //this.host = 'https://firekeeper.local:8090';
        } else {
            this.host = 'https://localhost:8090';
        }
        this.codec = 'H264/90000';
        //this.codec = 'VP8/90000';
        this.mobileTestMode = mobileTestMode;
    }

    public connect(callback: () => void): void {
        try {
            const configuration: RTCConfiguration = {
                iceServers: [
                    {
                        urls: "stun:stun2.1.google.com:19302"
                    }
                ]
            };
            this.peerConnection = new RTCPeerConnection(configuration);
            this.dataChannel = this.peerConnection.createDataChannel('recorder', {
                ordered: true
            });
            this.dataChannel.onerror = this.onError;
            this.dataChannel.onclose = this.onClose;
            callback();
        } catch (exception) {
            this.test(exception);
            const test = document.getElementById('test');
            if (test !== null) {
                test.innerHTML = exception;
            }
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

    public init(stream: MediaStream, videoElement: HTMLVideoElement): void {
        this.addStream(stream);
        this.peerConnection.addEventListener('track', function(evt) {
            if (evt.track.kind == 'video') {
                videoElement.srcObject = evt.streams[0];
            }
        });
    }

    public initIceGatheringListener(val: string, setter: (value: string) => void) {
        this.initListener('icegatheringstatechange', val, setter, this.peerConnection.iceGatheringState);
    }

    public initIceConnectionListener(val: string, setter: (value: string) => void) {
        this.initListener('iceconnectionstatechange', val, setter, this.peerConnection.iceConnectionState);
    }

    public initSignalingListener(val: string, setter: (value: string) => void) {
        this.initListener('signalingstatechange', val, setter, this.peerConnection.signalingState);
    }

    private initListener(event: string, val: string, setter: (value: string) => void, state: string): void {
        const pc = this.peerConnection;
        setter(state);
        pc.addEventListener(event, function() {
            setter(val + ' -> ' + state);
        }, false);
    }

    private addStream(stream: MediaStream) {
        const obj = this;
        const pc = this.peerConnection;
        stream.getTracks().forEach(function(track) {
            obj.peerConnection.addTrack(track, stream);
        });
        pc.createOffer()
            .then(offer => {
                pc.setLocalDescription(offer);
            })
            .then(() => {
                return new Promise<number>((resolve) => {
                    if (pc.iceGatheringState === 'complete') {
                        this.test('gather completed');
                        resolve(1);
                    } else {
                        const checkState = () => {
                            if (pc.iceGatheringState === 'complete') {
                                this.test('gather completed remove listener');
                                pc.removeEventListener('icegatheringstatechange', checkState);
                                resolve(1);
                            } else {
                                this.test(pc.iceGatheringState);
                            }
                        };
                        pc.addEventListener('icegatheringstatechange', checkState);
                    }
                });
            })
            .then(() => {
                const offer = pc.localDescription;
                if (offer === null) {
                    throw Error('offer null');
                }
                this.test('fetch');
                const sdp = this.sdpFilterCodec('video', this.codec, offer.sdp);
                const type = offer.type;
                return fetch(this.host + '/offer', {
                    body: JSON.stringify({
                        sdp: sdp,
                        type: type,
                        //video_transform: 'board'
                        video_transform: 'bgr'
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                });
            })
            .then(response => response.json())
            .then(answer => pc.setRemoteDescription(answer))
            .catch(error => alert('offer error' + error));
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

    private onClose(): void {
        console.log('datachannel closed');
    }

    private onError(error: RTCErrorEvent): void {
        console.log('datachannel error', error);
    }

    private sdpFilterCodec(kind: string, codec: string, realSdp: string): string {
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

    private test(message: string): void {
        if (this.mobileTestMode) {
            //alert(message);
            console.log(message);
        } else {
            console.log(message);
        }
    }
    
    private escapeRegExp(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
}