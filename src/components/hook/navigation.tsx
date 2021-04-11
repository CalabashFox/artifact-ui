import {useDispatch, useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import {setMove} from 'actions/sgf';

type NavigationFunction = (increment: number) => void;

const useNavigation = (): [NavigationFunction, NavigationFunction] => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const dispatch = useDispatch();

    const totalMoves = sgfState.analyzedSGF.isValid ? sgfState.analyzedSGF.moves.length - 1 : 0;
    const currentMove = sgfState.sgfProperties.currentMove;

    const navigateBackward = (increment: number) => {
        if (currentMove === 0) {
            return;
        }
        const move = currentMove - increment;
        if (move >= 0) {
            dispatch(setMove(move));
        } else {
            dispatch(setMove(0));
        }
    };

    const navigateForward = (increment: number) => {
        if (currentMove === totalMoves) {
            return;
        }
        const move = currentMove + increment;
        if (move < totalMoves) {
            dispatch(setMove(move));
        } else {
            dispatch(setMove(totalMoves));
        }
    };
    return [navigateBackward, navigateForward];
}
export default useNavigation;