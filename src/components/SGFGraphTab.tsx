import React, {useState, ReactElement} from 'react';
import { makeStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'react-redux';
import { SGFState, StoreState } from 'models/StoreState';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import useIcon from "components/icon";
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

const SGFGraphTab = (): ReactElement => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const [graphTabValue, setGraphTabValue] = useState(0);
    const [graphExpanded, setGraphExpanded] = useState(true);

    const toggleGraphTab = (event: React.ChangeEvent<Record<string, unknown>>, newValue: number) => {
        setGraphTabValue(newValue);
    };

    const handleGraphExpandClick = () => {
        setGraphExpanded(!graphExpanded);
    };

    const expandIcon = useIcon(<Down onClick={handleGraphExpandClick}/>);
    const collapseIcon = useIcon(<Up onClick={handleGraphExpandClick}/>);

    const playerProps = {
        playerBlack: sgfState.analyzedSGF.playerBlack,
        playerWhite: sgfState.analyzedSGF.playerWhite,
    };

    const blackMatchAnalysis = new Array<SGFGraphValue>();
    const whiteMatchAnalysis = new Array<SGFGraphValue>();
    
    let blackMatch = 0;
    sgfState.analyzedSGF.analysisData.blackMatchAnalysis.forEach((match, index) => {
        if (match) {
            blackMatch++;
        }
        blackMatchAnalysis.push({
            label: index.toString(),
            value: blackMatch / (index + 1) * 100
        })
    });

    let whiteMatch = 0;
    sgfState.analyzedSGF.analysisData.whiteMatchAnalysis.forEach((match, index) => {
        if (match) {
            whiteMatch++;
        }
        whiteMatchAnalysis.push({
            label: index.toString(),
            value: whiteMatch / (index + 1) * 100
        })
    });

    const graphs = new Array<ReactElement>();
    if (sgfState.hasSGF) {
        switch(graphTabValue) {
            case TAB_LEAD:
                graphs.push(<SGFGraph player={playerProps} identifier={`score-lead-graph`} name={sgfState.analyzedSGF.playerBlack} data={sgfState.analyzedSGF.analysisData.blackScoreLead} color={'#fff'}/>);
                break;
            case TAB_WINRATE:
                graphs.push(<SGFGraph player={playerProps} identifier={`winrate-graph`} name={sgfState.analyzedSGF.playerBlack} data={sgfState.analyzedSGF.analysisData.blackWinrate} color={'#fff'}/>);
                break;
            case TAB_SELFPLAY:
                graphs.push(<SGFGraph player={playerProps} identifier={`score-selfplay-graph`} name={sgfState.analyzedSGF.playerBlack} data={sgfState.analyzedSGF.analysisData.blackSelfplay} color={'#fff'}/>);
                break;
            case TAB_WINRATE_ANALYSIS:
                graphs.push(<SGFGraph player={null} identifier={`winrate-analysis-black`} name={sgfState.analyzedSGF.playerBlack} data={blackMatchAnalysis} color={'#fff'}/>);
                graphs.push(<SGFGraph player={null} identifier={`winrate-analysis-white`} name={sgfState.analyzedSGF.playerWhite} data={whiteMatchAnalysis} color={'#fff'}/>);
                break;
        }
    }

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
                {graphs}
            </div>
        </Collapse>
    </React.Fragment>;
}

export default SGFGraphTab;