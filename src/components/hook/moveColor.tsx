import { useMemo } from "react";
import { SGFColor } from "models/SGF";
import useValidSGF from "./validSGF";
import useCurrentSnapshot from "./currentSnapshot";
import { useSelector } from "react-redux";
import { GameState, StoreState } from "models/StoreState";

const useMoveColor = (): SGFColor => {
    const gameState = useSelector<StoreState, GameState>(state => state.gameState);
    const validSGF = useValidSGF();
    const snapshot = useCurrentSnapshot();

    const color = useMemo(() => {
        if (gameState.game.inGame) {
            return gameState.game.currentMove % 2 === 0 ? SGFColor.BLACK : SGFColor.WHITE;
        }
        if (validSGF && snapshot !== null) {
            const stones = snapshot.stones;
            return stones.length === 0 || stones[stones.length - 1][0] === 'W' 
                ? SGFColor.BLACK : SGFColor.WHITE;
        }
        return SGFColor.BLACK;
    }, [validSGF, snapshot, gameState.game.inGame, gameState.game.currentMove]);
    return color;
}
export default useMoveColor;