import {AnalyzedSGF, MovePriority, SGFProperties} from 'models/SGF';
import {KatagoMoveInfo} from 'models/Katago';

type Point = [number, number];

const tengen = [9, 9];
const hoshi = [[3, 3], [3, 9], [3, 15],
    [9, 3], [9, 15],
    [15, 3], [15, 9], [15, 15]
];

export default class SgfUtils {

    static translateToCoordinate(gtpLocation: string): Point {
        let col = gtpLocation.charCodeAt(0);
        if (col >= 'I'.charCodeAt(0)) {
            col--;
        }
        return [col - 65, Number.parseInt(gtpLocation.substr(1)) - 1];
    }

    static isTengen(point: [number, number]): boolean {
        return tengen[0] === point[0] && tengen[1] === point[1];
    }

    static isHoshi(point: [number, number]): boolean {
        return hoshi.some(p => p[0] === point[0] && p[1] === point[1]);
    }

    static calculateSGFAnalysisData(analyzedSGF: AnalyzedSGF | undefined): AnalyzedSGF | undefined {
        if (analyzedSGF === undefined) {
            return analyzedSGF;
        }
        analyzedSGF.analysisData = {
            blackWinrate: [],
            whiteWinrate: [],
            blackScoreLead: [],
            whiteScoreLead: [],
            blackSelfplay: [],
            whiteSelfplay: []
        }
        for (let i = 0; i < analyzedSGF.snapshotList.length; i++) {
            const info = analyzedSGF.snapshotList[i].katagoResults[0].rootInfo;
            const label = i.toString();
            const nullValue = {
                label: label,
                value: null
            };
            if (i % 2 === 0) {
                analyzedSGF.analysisData.blackWinrate.push({
                    label: label,
                    value: info.winrate * 100
                });
                analyzedSGF.analysisData.blackScoreLead.push({
                    label: label,
                    value: info.scoreLead
                });
                analyzedSGF.analysisData.blackSelfplay.push({
                    label: label,
                    value: info.scoreSelfplay
                });
                analyzedSGF.analysisData.whiteWinrate.push(nullValue);
                analyzedSGF.analysisData.whiteScoreLead.push(nullValue);
                analyzedSGF.analysisData.whiteScoreLead.push(nullValue);
            } else {

                analyzedSGF.analysisData.blackWinrate.push(nullValue);
                analyzedSGF.analysisData.blackScoreLead.push(nullValue);
                analyzedSGF.analysisData.blackSelfplay.push(nullValue);
                analyzedSGF.analysisData.whiteWinrate.push({
                    label: label,
                    value: info.winrate * 100
                });
                analyzedSGF.analysisData.whiteScoreLead.push({
                    label: label,
                    value: info.scoreLead
                });
                analyzedSGF.analysisData.whiteSelfplay.push({
                    label: label,
                    value: info.scoreSelfplay
                });
            }
        }
        return analyzedSGF;
    }

    static recalculateSnapshotAnalysisData(sgfProperties: SGFProperties, analyzedSGF: AnalyzedSGF | undefined): AnalyzedSGF | undefined {
        if (analyzedSGF === undefined) {
            return analyzedSGF;
        }
        for (const sgfSnapshot of analyzedSGF.snapshotList) {
            sgfSnapshot.analysisData = {
                moves: this.sortMoves(sgfProperties.movePriority, sgfSnapshot.katagoResults[0].moveInfos).slice(0, sgfProperties.moveCount)
            };
        }
        return analyzedSGF;
    }

    static sortMoves(movePriority: MovePriority, availableMoves: Array<KatagoMoveInfo>): Array<KatagoMoveInfo> {
        let sorter;
        switch (movePriority) {
            case MovePriority.WINRATE:
                sorter = (a: KatagoMoveInfo, b: KatagoMoveInfo) => {
                    return a.winrate - b.winrate;
                }
                break;
            default:
                sorter = (a: KatagoMoveInfo, b: KatagoMoveInfo) => {
                    return a.prior - b.prior;
                }
        }
        return availableMoves.sort(sorter);
    }

}