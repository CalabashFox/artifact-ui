import { appendLog, GameAction, reconnect, setGameState, setKatagoAnalysis, setKatagoTurn } from "actions/game";
import { GameActionState } from "models/Game";
import { KatagoMessage, KatagoResult, ReconnectMessage } from "models/Katago";
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
        } else if (message.type === 'RECONNECT') {
            const result: ReconnectMessage = JSON.parse(e.data);
            dispatch(setGameState(result.gameState));
            dispatch(setKatagoTurn(GameActionState.SUCCESS));
        }
    }

    disconnect() {
        this.connected = false;
    }


}