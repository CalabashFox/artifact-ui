import {useDispatch, useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import {navigate} from 'actions/sgf';
import { useCallback } from "react";

interface Navigation {
    rootNavigation: (index: number) => number
    rootIncremental: (incremental: number) => number
    coordinateNavigation: (row: number, col: number) => void
}

const bound = (value: number, lower: number, upper: number): number => {
    if (value > upper) {
        return upper;
    }
    if (value < lower) {
        return lower;
    }
    return value;
};

const useNavigation = (): Navigation => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const dispatch = useDispatch();

    const rootNavigation = useCallback((index: number): number => {
        if (isNaN(index)) {
            return sgfState.navigation.index;
        }
        const result = bound(index, 0, sgfState.branchNavigation.rootCol);
        dispatch(navigate({
            index: result,
            col: result,
            row: 0
        }));
        return result;
    }, [dispatch, sgfState.branchNavigation.rootCol, sgfState.navigation.index]);

    const rootIncremental = useCallback((incremental: number): number => {
        const index = sgfState.navigation.index + incremental;
        const result = bound(index, 0, sgfState.branchNavigation.rootCol);
        dispatch(navigate({
            index: result,
            col: result,
            row: 0
        }));
        return result;
    }, [dispatch, sgfState.navigation.index, sgfState.branchNavigation.rootCol]);

    const coordinateNavigation = useCallback((r: number, c: number) => {
        const row = bound(r, 0, sgfState.branchNavigation.row);
        const col = bound(c, 0, sgfState.branchNavigation.col);
        dispatch(navigate({
            index: sgfState.branchNavigation.navigationGraph[row][col].index,
            col: col,
            row: row
        }));
    }, [dispatch, sgfState.branchNavigation.navigationGraph, sgfState.branchNavigation.col, sgfState.branchNavigation.row]);

    return {
        rootNavigation: rootNavigation,
        rootIncremental: rootIncremental,
        coordinateNavigation: coordinateNavigation
    };
}
export default useNavigation;