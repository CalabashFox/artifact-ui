import { GameAction } from "actions/game";
import { Dispatch } from "react";

export default class SocketHandler {
    
    private connected: boolean;
    private dispatch: Dispatch<GameAction>;
    private socket: WebSocket;

    public constructor(dispatch: Dispatch<GameAction>) {
        this.connected = false;
        this.dispatch = dispatch;
        this.socket = new WebSocket('ws://localhost:8080/artifact/session');
    }

    sendMessage() {
        this.socket.send('');
    }

    connect() {
        this.socket.onopen = () => {
            this.connected = true;
        };
        this.socket.onmessage = this.onMessage;
    }

    onMessage(e: MessageEvent) {
        console.log(e.data);
    }

    disconnect() {

    }


}