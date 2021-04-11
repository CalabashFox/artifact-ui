import {useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import { useMemo } from "react";
import { SGFSnapshot, SGFSnapshotBranch } from "models/SGF";
import useValidSGF from "./validSGF";

const flatten = (array: Array<SGFSnapshot>, branch: SGFSnapshotBranch): void => {
    array.push(...branch.snapshotList);
    branch.snapshotList.forEach(snapshot => {
        snapshot.branches.forEach(snapshotBranch => flatten(array, snapshotBranch));
    })
};

const useSnapshots = (): Array<SGFSnapshot> => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const validSGF = useValidSGF();

    const snapshots = useMemo(() => {
        if (validSGF) {
            const array = new Array<SGFSnapshot>();
            flatten(array, sgfState.analyzedSGF.mainBranch);
            return array.sort((s1, s2) => s1.index - s2.index);
        }
        return [];
    }, [validSGF, sgfState.analyzedSGF]);
    return snapshots;
}
export default useSnapshots;