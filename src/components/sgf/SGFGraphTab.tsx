import React, {useState, useMemo} from 'react';
import { makeStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'react-redux';
import { SGFState, StoreState } from 'models/StoreState';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import useIcon from "components/hook/icon";
import Collapse from '@material-ui/core/Collapse';
import {Up, Down} from '@icon-park/react';
import SGFGraph from 'components/SGFGraph';
import { SGFGraphValue } from 'models/SGF';

const useStyles = makeStyles((theme: Theme) => ({
    info: {
        color: theme.palette.text.primary
    },
    graphContainer: {
        boxSizing: 'border-box',
        padding: theme.spacing(1)
    },
}));

const TAB_LEAD = 0, TAB_WINRATE = 1, TAB_SELFPLAY = 2, TAB_WINRATE_ANALYSIS = 3;

const calculateMatchScore = (winrates: Array<boolean>): Array<SGFGraphValue> => {
    const array = new Array<SGFGraphValue>();

    let totalMatch = 0;
    winrates.forEach((match, index) => {
        if (match) {
            totalMatch++;
        }
        array.push({
            label: index.toString(),
            value: totalMatch / (index + 1) * 100
        })
    });
    return array;
};

const SGFGraphTab: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const [graphTabValue, setGraphTabValue] = useState(0);
    const [graphExpanded, setGraphExpanded] = useState(true);

    const analysisData = sgfState.analyzedSGF.analysisData;

    const toggleGraphTab = (event: React.ChangeEvent<Record<string, unknown>>, newValue: number) => {
        setGraphTabValue(newValue);
    };

    const handleGraphExpandClick = () => {
        setGraphExpanded(!graphExpanded);
    };

    const expandIcon = useIcon(<Down onClick={handleGraphExpandClick}/>);
    const collapseIcon = useIcon(<Up onClick={handleGraphExpandClick}/>);

    const playerProps = useMemo(() => {
        return {
            playerBlack: sgfState.analyzedSGF.playerBlack,
            playerWhite: sgfState.analyzedSGF.playerWhite
        };
    }, [sgfState.analyzedSGF.playerBlack, sgfState.analyzedSGF.playerWhite]);

    const blackMatchAnalysis = useMemo(() => calculateMatchScore(analysisData.blackMatchAnalysis), [analysisData.blackMatchAnalysis]);
    const whiteMatchAnalysis = useMemo(() => calculateMatchScore(analysisData.whiteMatchAnalysis), [analysisData.whiteMatchAnalysis]);

    const COLOR = '#fffff3';

    const scoreLeadGraph = useMemo(() => 
        <SGFGraph 
            player={playerProps} 
            identifier={`score-lead-graph`} 
            name={playerProps.playerBlack} 
            data={analysisData.blackScoreLead} 
            color={COLOR}/> 
    , [playerProps, analysisData]);

    const winrateGraph = useMemo(() => 
        <SGFGraph 
            player={playerProps} 
            identifier={`winrate-graph`} 
            name={playerProps.playerBlack} 
            data={analysisData.blackWinrate} 
            color={COLOR}/> 
    , [playerProps, analysisData]);

    const selfplayGraph = useMemo(() => 
        <SGFGraph 
            player={playerProps} 
            identifier={`score-selfplay-graph`} 
            name={playerProps.playerBlack} 
            data={analysisData.blackSelfplay} 
            color={COLOR}/> 
    , [playerProps, analysisData]);

    const blackAnalysisGraph = useMemo(() =>
        <SGFGraph 
            player={null} 
            identifier={`winrate-analysis-black`} 
            name={playerProps.playerBlack} 
            data={blackMatchAnalysis} 
            color={COLOR}/> 
    , [playerProps, blackMatchAnalysis]);

    const whiteAnalysisGraph = useMemo(() =>
        <SGFGraph 
            player={null} 
            identifier={`winrate-analysis-white`} 
            name={playerProps.playerWhite} 
            data={whiteMatchAnalysis} 
            color={COLOR}/> 
    , [playerProps, whiteMatchAnalysis]);

    return <React.Fragment>
        <Grid container>
            <Grid item xs={11}>
                <Tabs
                    value={graphTabValue}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={toggleGraphTab}>
                    <Tab label="Lead" />
                    <Tab label="Winrate" />
                    <Tab label="Selfplay" />
                    <Tab label="Match analysis" />
                </Tabs>
            </Grid>
            <Grid item xs={1}>
                {graphExpanded && collapseIcon}
                {!graphExpanded && expandIcon}
            </Grid>
        </Grid>
        <Collapse in={graphExpanded} timeout="auto" unmountOnExit>
            <div className={classes.graphContainer}>
                {sgfState.hasSGF && graphTabValue === TAB_LEAD && scoreLeadGraph}
                {sgfState.hasSGF && graphTabValue === TAB_WINRATE && winrateGraph}
                {sgfState.hasSGF && graphTabValue === TAB_SELFPLAY && selfplayGraph}
                {sgfState.hasSGF && graphTabValue === TAB_WINRATE_ANALYSIS && [blackAnalysisGraph, whiteAnalysisGraph]}
            </div>
        </Collapse>
    </React.Fragment>;
}

export default SGFGraphTab;