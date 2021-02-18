import { appendLog, GameAction, setGameState, setKatagoAnalysis, setKatagoTurn } from "actions/game";
import { SGFAction, updateImageResult } from "actions/sgf";
import { GameActionState } from "models/Game";
import { KatagoMessage, KatagoResult, GameStateMessage, SGFImageMessage } from "models/Katago";
import { Dispatch } from "react";

type DispatchAction =  GameAction | SGFAction

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
            dispatch(appendLog(JSON.parse(e.data)));
        } else if (message.type === 'QUERY') {
            const result: KatagoResult = JSON.parse(e.data);
            dispatch(setKatagoAnalysis(result));
        } else if (message.type === 'GAME_STATE') {
            const result: GameStateMessage = JSON.parse(e.data);
            dispatch(setGameState(result.gameState));
            dispatch(setKatagoTurn(GameActionState.SUCCESS));
        } else if (message.type === 'IMAGE') {
            const result: SGFImageMessage = JSON.parse(e.data);
            dispatch(updateImageResult(result.katagoResult));
        }
    }

    disconnect() {
        this.connected = false;
    }


}