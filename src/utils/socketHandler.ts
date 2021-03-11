import { appendLog, GameAction, setGameState, setKatagoTurn } from "actions/game";
import { KatagoAction, setKatagoResult } from "actions/katago";
import { SGFAction } from "actions/sgf";
import { GameActionState } from "models/Game";
import { KatagoMessage, KatagoResult, GameStateMessage, SGFImageMessage } from "models/Katago";
import { Dispatch } from "react";

type DispatchAction =  GameAction | SGFAction | KatagoAction

export default class SocketHandler {
    
    private connected: boolean;

    public constructor() {
        this.connected = false;
    }

    connect(dispatch: Dispatch<DispatchAction>) {
        if (this.connected) {
            return;
        }
        const socket = new WebSocket('wss://localhost:8080');
        socket.onopen = () => {
            this.connected = true;
        };
        socket.onmessage = (e: MessageEvent) => {
            this.onMessage(dispatch, e);
        }
    }

    onMessage(dispatch: Dispatch<DispatchAction>, e: MessageEvent) {
        const message: KatagoMessage = JSON.parse(e.data);
        if (message.type === 'LOG') {
            console.log('log');
            dispatch(appendLog(JSON.parse(e.data)));
        } else if (message.type === 'QUERY') {
            console.log('query');
            const result: KatagoResult = JSON.parse(e.data);
            dispatch(setKatagoResult(result));
        } else if (message.type === 'GAME_STATE') {
            console.log('game_state');
            const result: GameStateMessage = JSON.parse(e.data);
            dispatch(setGameState(result.gameState));
            dispatch(setKatagoTurn(GameActionState.SUCCESS));
        }
    }

    disconnect() {
        this.connected = false;
    }


}