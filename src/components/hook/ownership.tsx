import {useSelector} from "react-redux";
import {SGFState, StoreState, KatagoState} from "models/StoreState";
import { useMemo } from "react";
import useValidSGF from "./validSGF";
import useCurrentSnapshot from "./currentSnapshot";

const useOwnership = (): Array<number> => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const katagoState = useSelector<StoreState, KatagoState>(state => state.katagoState);
    const validSGF = useValidSGF();
    const snapshot = useCurrentSnapshot();

    const ownership = useMemo(() => {
        if (validSGF) {
            if (sgfState.sgfProperties.liveMode) {
                return katagoState.katagoResult.ownership;
            } else if (snapshot !== null && snapshot.katagoResult !== null) {
                return snapshot.katagoResult.ownership;
            }
        }
        return [];
    }, [validSGF, snapshot, katagoState.katagoResult, sgfState.sgfProperties.liveMode]);
    return ownership;
}
export default useOwnership;