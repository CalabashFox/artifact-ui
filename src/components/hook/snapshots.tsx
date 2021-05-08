import {useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import { useMemo } from "react";
import { SGFSnapshot } from "models/SGF";
import useValidSGF from "./validSGF";
import SgfUtils from "utils/sgfUtils";

const useSnapshots = (): Array<SGFSnapshot> => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const validSGF = useValidSGF();

    const snapshots = useMemo(() => {
        if (validSGF) {
            return SgfUtils.flattenSnapshotList(sgfState.analyzedSGF, true);
        }
        return [];
    }, [validSGF, sgfState.analyzedSGF]);
    return snapshots;
}
export default useSnapshots;