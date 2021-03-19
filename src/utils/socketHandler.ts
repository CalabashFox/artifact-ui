import { appendLog, GameAction, setGameState, setKatagoTurn } from "actions/game";
import { KatagoAction, setKatagoResult } from "actions/katago";
import { SGFAction } from "actions/sgf";
import { setSocketConnectionState, ViewAction } from "actions/view";
import { GameActionState } from "models/Game";
import { KatagoMessage, KatagoResult, GameStateMessage } from "models/Katago";
import { SocketConnectionState } from "models/view";
import { Dispatch } from "react";

type DispatchAction =  GameAction | SGFAction | KatagoAction | ViewAction;

export default class SocketHandler {
    
    private connected: boolean;

    public constructor() {
        this.connected = false;
    }

    connect(dispatch: Dispatch<DispatchAction>) {
        if (this.connected) {
            return;
        }
        dispatch(setSocketConnectionState(SocketConnectionState.CONNECTING));
        try {
            const socket = new WebSocket('ws://localhost:8080');
            socket.onopen = () => {
                dispatch(setSocketConnectionState(SocketConnectionState.CONNECTED));
            };
            socket.onmessage = (e: MessageEvent) => {
                this.onMessage(dispatch, e);
            }
            socket.onerror = () => {
                dispatch(setSocketConnectionState(SocketConnectionState.CANNOT_CONNECT));
            };
            socket.onclose = () => {
                if (this.connected) {
                    dispatch(setSocketConnectionState(SocketConnectionState.DISCONNECTED));
                } else {
                    dispatch(setSocketConnectionState(SocketConnectionState.CANNOT_CONNECT));
                }
                this.disconnect();
            };
        } catch(e: any) {
            dispatch(setSocketConnectionState(SocketConnectionState.CANNOT_CONNECT));
        }
    }

    onMessage(dispatch: Dispatch<DispatchAction>, e: MessageEvent) {
        const message: KatagoMessage = JSON.parse(e.data);
        console.log(message);
        if (message.type === 'LOG') {
            dispatch(appendLog(JSON.parse(e.data)));
        } else if (message.type === 'QUERY') {
            const result: KatagoResult = JSON.parse(e.data);
            dispatch(setKatagoResult(result));
        } else if (message.type === 'GAME_STATE') {
            const result: GameStateMessage = JSON.parse(e.data);
            dispatch(setGameState(result.gameState));
            dispatch(setKatagoTurn(GameActionState.SUCCESS));
        }
    }

    disconnect() {
        this.connected = false;
    }


}