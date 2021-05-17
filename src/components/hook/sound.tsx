import {useEffect, useState, useCallback} from "react";
import {useDispatch} from "react-redux";
import { GameActionState } from "models/Game";
import { actionStateUpdate } from "actions/game";

const useSound = (src: string, actionState: GameActionState, activationState: GameActionState): void => {
    const [audio] = useState(() => new Audio(src));
    const dispatch = useDispatch();
    
    useEffect(() => {
        return () => {
            audio.pause();
        };
    }, [audio]);

    const play = useCallback(() => {
        audio.currentTime = 0;
        audio.play();
    }, [audio]);

    useEffect(() => {
        if (actionState === activationState) {
            play();
            dispatch(actionStateUpdate(GameActionState.PENDING));
        }
    }, [actionState, dispatch, activationState, play]);
};
export default useSound;