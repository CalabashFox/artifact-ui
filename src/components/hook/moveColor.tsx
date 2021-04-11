import { useMemo } from "react";
import { SGFColor } from "models/SGF";
import useValidSGF from "./validSGF";
import useCurrentSnapshot from "./currentSnapshot";

const useMoveColor = (): SGFColor => {
    const validSGF = useValidSGF();
    const snapshot = useCurrentSnapshot();

    const color = useMemo(() => {
        if (validSGF && snapshot !== null) {
            const stones = snapshot.stones;
            return stones.length === 0 || stones[stones.length - 1][0] === 'W' 
                ? SGFColor.BLACK : SGFColor.WHITE;
        }
        return SGFColor.BLACK;
    }, [validSGF, snapshot]);
    return color;
}
export default useMoveColor;