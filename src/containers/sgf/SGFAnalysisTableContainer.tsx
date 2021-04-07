import React from "react";
import {useSelector} from 'react-redux';
import {KatagoState, SGFState, StoreState} from 'models/StoreState';
import SGFAnalysisTable from "components/sgf/SGFAnalysisTable";
import { KatagoMoveInfo } from "models/Katago";

const SGFAnalysisTableContainer: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const katagoState = useSelector<StoreState, KatagoState>(state => state.katagoState);

    let data: Array<KatagoMoveInfo> = [];
    if (sgfState.hasSGF && sgfState.analyzedSGF.isValid) {
        const snapshot = sgfState.analyzedSGF.snapshotList[sgfState.sgfProperties.currentMove];
        if (sgfState.sgfProperties.liveMode) {
            data = katagoState.katagoResult.moveInfos;
        } else if (snapshot.katagoResults.length > 0) {
            data = snapshot.katagoResults[0].moveInfos;
        }
    }
/*
    data = [
        {
            move: 'A0',
            visits: 30,
            winrate: 0.03,
            scoreMean: 1231231,
            scoreLead: 123123,
            scoreSelfplay: 123123,
            scoreStdev: 123123,
            utility: 123132,
            utilityLcb: 123123,
            lcb: 33,
            prior: 22,
            order: 11,
            pvVisits: 22,
            pv: []
        },
        {
            move: 'K1',
            visits: 20,
            winrate: 0.53,
            scoreMean: 1231231,
            scoreLead: 122,
            scoreSelfplay: 123123,
            scoreStdev: 123123,
            utility: 123132,
            utilityLcb: 123123,
            lcb: 33,
            prior: 22,
            order: 11,
            pvVisits: 22,
            pv: []
        },
        {
            move: 'A9',
            visits: 550,
            winrate: 0.13,
            scoreMean: 1231231,
            scoreLead: -3,
            scoreSelfplay: 123123,
            scoreStdev: 123123,
            utility: 123132,
            utilityLcb: 123123,
            lcb: 33,
            prior: 22,
            order: 11,
            pvVisits: 22,
            pv: []
        },
        {
            move: 'B5',
            visits: 35,
            winrate: 0.93,
            scoreMean: 1231231,
            scoreLead: 330,
            scoreSelfplay: 123123,
            scoreStdev: 123123,
            utility: 123132,
            utilityLcb: 123123,
            lcb: 33,
            prior: 22,
            order: 11,
            pvVisits: 22,
            pv: []
        }
    ];*/
    return <SGFAnalysisTable data={data}/>;
}

export default SGFAnalysisTableContainer;