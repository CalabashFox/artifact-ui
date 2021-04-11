import {useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import { useMemo } from "react";

const useValidSGF = (): boolean => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    return useMemo(() => sgfState.hasSGF && sgfState.analyzedSGF.isValid, [sgfState.hasSGF, sgfState.analyzedSGF.isValid]);
}
export default useValidSGF;