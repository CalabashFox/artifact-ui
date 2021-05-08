import {useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import { useMemo } from "react";
import { SGFSnapshot } from "models/SGF";
import useValidSGF from "./validSGF";
import useSnapshots from "./snapshots";

const useCurrentSnapshot = (): SGFSnapshot | null => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const validSGF = useValidSGF();
    const snapshotList = useSnapshots();

    return useMemo(() => {
        if (validSGF && sgfState.navigation.index < snapshotList.length) {
            return snapshotList[sgfState.navigation.index];
        }
        return null;
    }, [validSGF, sgfState.navigation.index, snapshotList]);
}
export default useCurrentSnapshot;