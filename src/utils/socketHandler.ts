import { appendLog, GameAction, setKatagoAnalysis } from "actions/game";
import { KatagoLog, KatagoMessage, KatagoResult } from "models/Katago";
import { Dispatch } from "react";

export default class SocketHandler {
    
    private connected: boolean;

    public constructor() {
        this.connected = false;
    }

    connect(dispatch: Dispatch<GameAction>) {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            this.connected = true;
        };
        socket.onmessage = (e: MessageEvent) => {
            this.onMessage(dispatch, e);
        }
    }

    onMessage(dispatch: Dispatch<GameAction>, e: MessageEvent) {
        const message: KatagoMessage = JSON.parse(e.data);
        if (message.type === 'LOG') {
            dispatch(appendLog(JSON.parse(e.data)));
        } else if (message.type === 'QUERY') {
            const result: KatagoResult = JSON.parse(e.data);
            dispatch(setKatagoAnalysis(result));
        }    
    }

    disconnect() {

    }


}