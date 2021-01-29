import {AnalyzedSGF, MovePriority, SGFProperties, SGFStackGraphValue} from 'models/SGF';
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
            whiteSelfplay: [],
            blackWinrateAnalysis: [],
            whiteWinrateAnalysis: [],
            blackMatch: 0,
            whiteMatch: 0,
            blackMatchAnalysis: [],
            whiteMatchAnalysis: []
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
                    value: 100 - info.winrate * 100
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

    static calculateSGFMatchAnalysisData(sgfProperties: SGFProperties, analyzedSGF: AnalyzedSGF): AnalyzedSGF {
        const topMoves = sgfProperties.topMatch - 1;
        const blackMove = new Array<string>();
        const whiteMove = new Array<string>();
        for (let i = 0; i < analyzedSGF.snapshotList.length; i+=2) {
            const analysisResult = analyzedSGF.snapshotList[i].katagoResults[0];
            const currentMove = analysisResult.rootInfo;
            const moves = analysisResult.moveInfos;
            const bestMove = moves[0];
            const black = {
                label: i.toString(),
                player: currentMove.winrate * 100,
                ai: 0,
                diff: 0
            };
            const white = {
                label: (i + 1).toString(),
                player: 0,
                ai: 100 - bestMove.winrate * 100,
                diff: 0
            };
            let blackMatch = false;
            let whiteMatch = false;
            if (i + 1 < analyzedSGF.snapshotList.length) {
                const nextMove = analysisResult.rootInfo;
                white.player = 100 - nextMove.winrate * 100;
                white.diff = white.ai - white.player;

                const whiteMove = analyzedSGF.snapshotList[i + 1].stones[analyzedSGF.snapshotList[i + 1].stones.length - 1][1];
                whiteMatch = analysisResult.moveInfos.slice(topMoves).some(m => m.move === whiteMove);
            }
            if (i - 1 > 0) {
                const prevBestMove = analyzedSGF.snapshotList[i - 1].katagoResults[0].moveInfos[0];
                black.ai = prevBestMove.winrate * 100;
                black.diff = black.ai - black.player;

                const blackMove = analyzedSGF.snapshotList[i].stones[analyzedSGF.snapshotList[i].stones.length - 1][1];
                blackMatch = analyzedSGF.snapshotList[i - 1].katagoResults[0].moveInfos.slice(topMoves).some(m => m.move === blackMove);
            }
            analyzedSGF.analysisData.blackWinrateAnalysis.push(black);
            analyzedSGF.analysisData.whiteWinrateAnalysis.push(white);
            analyzedSGF.analysisData.blackMatchAnalysis.push(blackMatch);
            analyzedSGF.analysisData.whiteMatchAnalysis.push(whiteMatch);
        }
        analyzedSGF.analysisData.blackMatch = analyzedSGF.analysisData.blackMatchAnalysis.filter(v => v).length / analyzedSGF.analysisData.blackMatchAnalysis.length;
        analyzedSGF.analysisData.whiteMatch = analyzedSGF.analysisData.whiteMatchAnalysis.filter(v => v).length / analyzedSGF.analysisData.whiteMatchAnalysis.length;
        analyzedSGF.analysisData.blackWinrateAnalysis[0].ai = analyzedSGF.analysisData.blackWinrateAnalysis[0].player;
        return analyzedSGF;
    }

    static recalculateSnapshotAnalysisData(sgfProperties: SGFProperties, analyzedSGF: AnalyzedSGF): AnalyzedSGF {
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
                    return b.winrate - a.winrate;
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