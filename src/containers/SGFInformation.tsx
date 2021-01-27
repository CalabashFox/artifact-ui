import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import SGFGraph from 'components/SGFGraph';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import blackIcon from 'assets/images/black.svg';
import blackTurnIcon from 'assets/images/black-turn.svg';
import whiteIcon from 'assets/images/white.svg';
import whiteTurnIcon from 'assets/images/white-turn.svg';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import { SGFGraphValue } from 'models/SGF';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(1)
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
        backgroundColor: theme.palette.primary.light
    },
    whitePlayer: {
        color: '#fff'
    },
    blackPlayer: {
        color: '#0'
    },
    playerTitle: {
        fontSize: 20,
        display: 'inline-block',
        verticalAlign: 'middle',
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    },
    statusContainer: {
        width: '100%'
    },
    status: {
        height: 20,
        display: 'inline-block',
        textAlign: 'center'
    },
    blackStatus: {
        backgroundColor: '#000',
        color: '#fff'
    },
    whiteStatus: {
        backgroundColor: '#fff',
        color: '#000'
    },
    graphContainer: {
        boxSizing: 'border-box',
        padding: theme.spacing(1)
    },
    divider: {
        color: '#fff',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    info: {
        color: '#fff'
    }
}));

const SGFInformation: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const [graphTabValue, setGraphTabValue] = useState(0);

    // eslint-disable-next-line @typescript-eslint/ban-types
    const toggleGraphTab = (event: React.ChangeEvent<{ }>, newValue: number) => {
        setGraphTabValue(newValue);
    };

    if (sgfState.analyzedSGF === undefined || sgfState.analyzedSGF.analysisData === undefined) {
        return <div>1</div>;
    }

    const index = sgfState.sgfProperties.currentMove;
    const useBlackData = index % 2 === 0;
    const winrateList = useBlackData ? sgfState.analyzedSGF.analysisData.blackWinrate : sgfState.analyzedSGF.analysisData.whiteWinrate;
    const winrate = winrateList[index].value ?? 0;
    const blackWinrate = useBlackData ? winrate : 100 - winrate;
    const whiteWinrate = 100 - blackWinrate;

    const showDiff = index >= 1;

    let previousWinrate = 0;
    let blackWinrateDiff = 0;
    let whiteWinrateDiff = 0;
    if (showDiff) {
        const previousWinrateList = useBlackData ? sgfState.analyzedSGF.analysisData.whiteWinrate : sgfState.analyzedSGF.analysisData.blackWinrate;
        const prevWinrate = previousWinrateList[index - 1].value ?? 0;
        previousWinrate = useBlackData ? prevWinrate : 100 - prevWinrate;
        whiteWinrateDiff = whiteWinrate - previousWinrate;
        blackWinrateDiff = -whiteWinrateDiff;
    }

    let graph;
    switch(graphTabValue) {
        case 0:
            graph = <SGFGraph identifier={`score-lead-graph`} name={sgfState.analyzedSGF.playerBlack} data={sgfState.analyzedSGF.analysisData.blackScoreLead} color={'#fff'}/>;
            break;
        case 1:
            graph = <SGFGraph identifier={`winrate-graph`} name={sgfState.analyzedSGF.playerBlack} data={sgfState.analyzedSGF.analysisData.blackWinrate} color={'#fff'}/>;
            break;
        case 2:
            graph = <SGFGraph identifier={`score-selfplay-graph`} name={sgfState.analyzedSGF.playerBlack} data={sgfState.analyzedSGF.analysisData.blackSelfplay} color={'#fff'}/>;
            break;
    }

    const gameInfo = sgfState.analyzedSGF;
    const headers = [];
    const info = [];
    if (gameInfo.event) {
        headers.push(<Typography noWrap>Event: </Typography>);
        info.push(<Typography noWrap>{gameInfo.event} (Round {gameInfo.round})</Typography>);
    }
    if (gameInfo.date) {
        headers.push(<Typography noWrap>Date: </Typography>);
        info.push(<Typography noWrap>{gameInfo.date}</Typography>);
    }

    if (gameInfo.rules) {
        headers.push(<Typography noWrap>Rule: </Typography>);
        info.push(<Typography noWrap>{gameInfo.rules}</Typography>);
    }

    if (gameInfo.timeLimit) {
        headers.push(<Typography noWrap>Time: </Typography>);
        info.push(<Typography noWrap>{gameInfo.timeLimit}</Typography>);
    }

    if (gameInfo.komi) {
        headers.push(<Typography noWrap>Komi: </Typography>);
        info.push(<Typography noWrap>{gameInfo.komi}</Typography>);
    }

    if (gameInfo.result) {
        headers.push(<Typography noWrap>Result: </Typography>);
        info.push(<Typography noWrap>{gameInfo.result}</Typography>);
    }

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

    return <div>
        <Paper className={classes.paper}>
            <Grid container spacing={1} className={classes.info}>
                <Grid item xs={3}>
                    {headers}
                </Grid>
                <Grid item xs={9}>
                    {info}
                </Grid>
            </Grid>
            <Divider className={classes.divider}/>
            <Grid container spacing={1}>
                <Grid item xs={6} className={classes.blackPlayer}>
                    <img src={useBlackData ? blackTurnIcon : blackIcon} className={classes.playerTitle} alt="black"/>
                    <Typography className={classes.playerTitle} noWrap>
                        {sgfState.analyzedSGF.playerBlack}({sgfState.analyzedSGF.rankBlack})
                    </Typography>
                </Grid>
                <Grid item xs={6} className={classes.whitePlayer}>
                    <img src={useBlackData ? whiteIcon : whiteTurnIcon} className={classes.playerTitle} alt="white"/>
                    <Typography className={classes.playerTitle} noWrap>
                        {sgfState.analyzedSGF.playerWhite}({sgfState.analyzedSGF.rankWhite})
                    </Typography>
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item xs={6} className={classes.blackPlayer}>
                    <Typography className={classes.playerTitle} noWrap>

                    </Typography>
                </Grid>
            </Grid>
            <div className={classes.statusContainer}>
                <div className={[classes.blackStatus, classes.status].join(' ')} style={{width: blackWinrate + '%'}}>
                    {blackWinrate.toFixed(1) + '%'} {showDiff && blackWinrateDiff > 0 ? '(+' + blackWinrateDiff.toFixed(1) + '%)' : ''}
                </div>
                <div className={[classes.whiteStatus, classes.status].join(' ')} style={{width: whiteWinrate + '%'}}>
                    {whiteWinrate.toFixed(1) + '%'} {showDiff && whiteWinrateDiff > 0 ? '(+' + whiteWinrateDiff.toFixed(1) + '%)' : ''}
                </div>
            </div>
        </Paper>
        <Paper className={classes.paper}>
            <Tabs
                value={graphTabValue}
                indicatorColor="primary"
                textColor="primary"
                onChange={toggleGraphTab}>
                <Tab label="Lead" />
                <Tab label="Winrate" />
                <Tab label="Selfplay" />
            </Tabs>
            <div className={classes.graphContainer}>
                {graph}
            </div>
        </Paper>
        <Paper className={classes.paper}>
            <SGFGraph identifier={`winrate-analysis-black`} name={sgfState.analyzedSGF.playerBlack} data={blackMatchAnalysis} color={'#fff'}/>
        </Paper>

        <Paper className={classes.paper}>
            <SGFGraph identifier={`winrate-analysis-white`} name={sgfState.analyzedSGF.playerWhite} data={whiteMatchAnalysis} color={'#fff'}/>
        </Paper>
    </div>;
};

export default SGFInformation;