import {useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import { useMemo } from "react";
import { useTranslation } from 'react-i18next';

const convert = (name: string, defaultValue: string): string => {
    if (name && name !== '') {
        return 'player.' + name.toLowerCase().replace(' ', '.');
    } else {
        return 'player.' + defaultValue;
    }
};

const usePlayerTitle = (): [string, string, string, string] => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const { t } = useTranslation();
    const hasValidSGF = useMemo(() => sgfState.hasSGF && sgfState.analyzedSGF.isValid, [sgfState.hasSGF, sgfState.analyzedSGF.isValid]);

    return useMemo(() => {
        if (hasValidSGF) {
            return [
                t(convert(sgfState.analyzedSGF.playerBlack, 'black'))
                , t(convert(sgfState.analyzedSGF.playerWhite, 'white'))
                , t(convert(sgfState.analyzedSGF.rankBlack, 'unknown'))
                , t(convert(sgfState.analyzedSGF.rankWhite, 'unknown'))];
        }
        return [convert('', 'black'), convert('', 'white'), '', ''];
    }, [hasValidSGF, sgfState.analyzedSGF, t]);
}
export default usePlayerTitle;