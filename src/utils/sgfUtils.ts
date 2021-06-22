import {AnalyzedSGF, MovePriority, SGFBranchNavigation, SGFBranchNode, SGFColor, SGFProperties, SGFSnapshot, SGFSnapshotBranch, SGFStackGraphValue, SGFStone, WinrateReport} from 'models/SGF';
import {KatagoMoveInfo} from 'models/Katago';

type Point = [number, number];

const MAX_BRANCH_LEVEL = 15;

export default class SgfUtils {
    
    static renderBranchNavigation(analyzedSGF: AnalyzedSGF): SGFBranchNavigation {
        const snapshots = this.flattenSnapshotList(analyzedSGF, false);
        const { branchGraph, row, col, rootCol, total } = this.renderBranchNodeGraph(snapshots);
        const navigationGraph = this.renderNavigationGraph(branchGraph, snapshots);
        return {
            branchGraph: branchGraph,
            navigationGraph: navigationGraph,
            row: row,
            col: col,
            rootCol: rootCol,
            total: total
        }
    }

    private static renderBranchNodeGraph(snapshots: Array<SGFSnapshot>)
        : { branchGraph: SGFBranchNode[][], row: number, col: number, rootCol: number, total: number } {
        const graph: SGFBranchNode[][] = new Array(MAX_BRANCH_LEVEL)
            .fill(null)
            .map(() => new Array(snapshots.length).fill(null));
        const moveIndexMap = new Map<number, Array<SGFSnapshot>>();
        const coordinateMap = new Map<string, SGFBranchNode>();
        let levels = 0;
        let moves = 0;
        // ignore empty board
        for (let i = 1; i < snapshots.length; i++) { 
            const snapshot = snapshots[i];
            if (!moveIndexMap.has(snapshot.moveIndex)) {
                moveIndexMap.set(snapshot.moveIndex, new Array<SGFSnapshot>());
            }
            moveIndexMap.get(snapshot.moveIndex)?.push(snapshot);
        }
        const branchLevelMap = new Map<number, number>();
        for (let i = 0; i <= moveIndexMap.size; i++) {
            const snapshots = moveIndexMap.get(i) ?? new Array<SGFSnapshot>();
            snapshots.forEach(snapshot => {
                let adjustedLevel = branchLevelMap.get(snapshot.branchId) ?? snapshot.level;
                while (graph[adjustedLevel][snapshot.moveIndex] !== null) {
                    adjustedLevel++;
                }
                branchLevelMap.set(snapshot.branchId, adjustedLevel);
                const node: SGFBranchNode = {
                    level: snapshot.level,
                    index: snapshot.index,
                    moveIndex: snapshot.moveIndex,
                    color: this.getCurrentSGFColor(snapshot.stones),
                    label: snapshot.stones[snapshot.stones.length - 1][1],
                    adjustedLevel: adjustedLevel,
                    branchId: snapshot.branchId,
                    branchHead: snapshot.branchIndex === 0,
                    rootBranchId: snapshot.rootBranchId,
                    previousNode: undefined
                };
                graph[adjustedLevel][snapshot.moveIndex] = node;
                if (snapshot.branchIndex === 0) {
                    node.previousNode = coordinateMap.get(`coord-${snapshot.rootBranchId}-${snapshot.moveIndex - 1}`);
                } else {
                    node.previousNode = coordinateMap.get(`coord-${snapshot.branchId}-${snapshot.moveIndex - 1}`);
                }
                coordinateMap.set(`coord-${snapshot.branchId}-${snapshot.moveIndex}`, node);
                if (adjustedLevel > levels) {
                    levels = adjustedLevel;
                }
                if (snapshot.moveIndex > moves) {
                    moves = snapshot.moveIndex;
                }
            });
        }
        const result: SGFBranchNode[][] = new Array(levels + 1)
            .fill(null)
            .map(() => new Array(moves + 1).fill(null));

        // strip graph
        for (let i = 0; i <= levels; i++) {
            for (let j = 0; j <= moves; j++) {
                result[i][j] = graph[i][j];
            }
        }
        return { 
            branchGraph: result,
            row: levels + 1,
            col: moves + 1,
            rootCol: result[0].filter(node => node !== null).length,
            total: snapshots.length
         };
    }

    private static renderNavigationGraph(graph: SGFBranchNode[][], snapshots: Array<SGFSnapshot>): SGFSnapshot[][] {
        const sorted = snapshots.sort((s1, s2) => s1.index - s2.index);
        const result: SGFSnapshot[][] = new Array(graph.length)
            .fill(null)
            .map(() => new Array(graph[0].length).fill(null));
        for (let i = 0; i < graph.length; i++) {
            for (let j = 0; j < graph[0].length; j++) {
                if (graph[i][j] !== null) {
                    result[i][j] = sorted[graph[i][j].index];
                }
            }
        }
        return result;
    }

    private static getCurrentSGFColor(stones: Array<SGFStone>): SGFColor {
        return stones[stones.length - 1][0] === 'B' ? SGFColor.BLACK : SGFColor.WHITE;
    }

    static flattenSnapshotList(analyzedSGF: AnalyzedSGF, sortByIndex: boolean): Array<SGFSnapshot> {
        const array = new Array<SGFSnapshot>();
        const flatten = (array: Array<SGFSnapshot>, branch: SGFSnapshotBranch): void => {
            array.push(...branch.snapshotList);
            branch.snapshotList.forEach((snapshot: SGFSnapshot) => {
                snapshot.branches.forEach(snapshotBranch => flatten(array, snapshotBranch));
            })
        };
        flatten(array, analyzedSGF.mainBranch);
        const branchSorter = (s1: SGFSnapshot, s2 : SGFSnapshot) => {
            const branchDiff = s1.branchId - s2.branchId;
            if (branchDiff !== 0) {
                return branchDiff;
            }
            return s1.moveIndex - s2.moveIndex;
        };
        const indexSorter = (s1: SGFSnapshot, s2 : SGFSnapshot) => s1.index - s2.index;
        if (sortByIndex) {
            return array.sort(indexSorter);
        } else {
            return array.sort(branchSorter);
        }
    }

    static translateToCoordinate(gtpLocation: string): Point {
        let col = gtpLocation.charCodeAt(0);
        if (col >= 'I'.charCodeAt(0)) {
            col--;
        }
        return [col - 65, Number.parseInt(gtpLocation.substr(1)) - 1];
    }
    
    static calculateSGFAnalysisData(sgfProperties: SGFProperties, analyzedSGF: AnalyzedSGF | undefined): AnalyzedSGF | undefined {
        if (analyzedSGF === undefined || !analyzedSGF.useAnalysis || analyzedSGF.analyzedSnapshots === 0) {
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
        }/*
        for (let i = 0; i < analyzedSGF.snapshotList.length; i++) {
            const snapshot = analyzedSGF.snapshotList[i];
            const info = snapshot.katagoResults[0].rootInfo;
            const blackTurn = i === 0 || analyzedSGF.handicap > 0 || snapshot.stones[snapshot.stones.length - 1][0] === 'B';
            const label = i.toString();
            if (blackTurn || sgfProperties.reportAnalysisWinratesAs === WinrateReport.BLACK) {
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
                analyzedSGF.analysisData.whiteWinrate.push({
                    label: label,
                    value: 100 - info.winrate * 100
                });
                analyzedSGF.analysisData.whiteScoreLead.push({
                    label: label,
                    value: 0 - info.scoreLead
                });
                analyzedSGF.analysisData.whiteScoreLead.push({
                    label: label,
                    value: 0 - info.scoreSelfplay
                });
            } else {
                analyzedSGF.analysisData.blackWinrate.push({
                    label: label,
                    value: 100 - info.winrate * 100
                });
                analyzedSGF.analysisData.blackScoreLead.push({
                    label: label,
                    value: 0 - info.scoreLead
                });
                analyzedSGF.analysisData.blackSelfplay.push({
                    label: label,
                    value: 0 - info.scoreSelfplay
                });
                analyzedSGF.analysisData.whiteWinrate.push({
                    label: label,
                    value: info.winrate * 100
                });
                analyzedSGF.analysisData.whiteScoreLead.push({
                    label: label,
                    value: info.scoreLead
                });
                analyzedSGF.analysisData.whiteScoreLead.push({
                    label: label,
                    value: info.scoreSelfplay
                });
            }
        }*/
        return analyzedSGF;
    }

    static calculateSGFMatchAnalysisData(sgfProperties: SGFProperties, analyzedSGF: AnalyzedSGF): AnalyzedSGF {
        if (analyzedSGF === undefined || !analyzedSGF.useAnalysis || analyzedSGF.analyzedSnapshots === 0) {
            return analyzedSGF;
        }/*
        const matchRecommended = sgfProperties.matchRecommended - 1;
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
                whiteMatch = analysisResult.moveInfos.slice(matchRecommended).some(m => m.move === whiteMove);
            }
            if (i - 1 > 0) {
                const prevBestMove = analyzedSGF.snapshotList[i - 1].katagoResults[0].moveInfos[0];
                black.ai = prevBestMove.winrate * 100;
                black.diff = black.ai - black.player;

                const blackMove = analyzedSGF.snapshotList[i].stones[analyzedSGF.snapshotList[i].stones.length - 1][1];
                blackMatch = analyzedSGF.snapshotList[i - 1].katagoResults[0].moveInfos.slice(matchRecommended).some(m => m.move === blackMove);
            }
            analyzedSGF.analysisData.blackWinrateAnalysis.push(black);
            analyzedSGF.analysisData.whiteWinrateAnalysis.push(white);
            analyzedSGF.analysisData.blackMatchAnalysis.push(blackMatch);
            analyzedSGF.analysisData.whiteMatchAnalysis.push(whiteMatch);
        }
        analyzedSGF.analysisData.blackMatch = analyzedSGF.analysisData.blackMatchAnalysis.filter(v => v).length / analyzedSGF.analysisData.blackMatchAnalysis.length;
        analyzedSGF.analysisData.whiteMatch = analyzedSGF.analysisData.whiteMatchAnalysis.filter(v => v).length / analyzedSGF.analysisData.whiteMatchAnalysis.length;
        analyzedSGF.analysisData.blackWinrateAnalysis[0].ai = analyzedSGF.analysisData.blackWinrateAnalysis[0].player;*/
        return analyzedSGF;
    }

    static recalculateSnapshotAnalysisData(sgfProperties: SGFProperties, analyzedSGF: AnalyzedSGF): AnalyzedSGF {
        if (analyzedSGF === undefined || !analyzedSGF.useAnalysis || analyzedSGF.analyzedSnapshots === 0) {
            return analyzedSGF;
        }
        /*
        for (const sgfSnapshot of analyzedSGF.snapshotList) {
            sgfSnapshot.analysisData = {
                moves: this.sortMoves(sgfProperties.movePriority, sgfSnapshot.katagoResults[0].moveInfos).slice(0, sgfProperties.moveCount)
            };
        }*/
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