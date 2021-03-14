import React, {useState, ChangeEvent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import useIconText from 'components/iconText';
import useIcon from 'components/icon';
import useTimer from 'components/timer';
import Progress from 'components/Progress';
import {Upload, Info, Config} from '@icon-park/react'
import Popover from '@material-ui/core/Popover';

import { loadProgress, uploadSGFFile } from 'actions/sgf';
import SGFData from 'components/SGFData';
import SGFBoardSettings from 'components/SGFBoardSettings';

const useStyles = makeStyles(() => ({
    statusContainer: {
        textAlign: 'left'
    },
    infoContainer: {
        textAlign: 'right'
    },
    input: {
        display: 'none',
    },
    popover: {
        pointerEvents: 'none'
    },
}));

const SGFStatusBar: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const dispatch = useDispatch();
    
    const [sgfBoardSettingsOpen, setSGFBoardSettingsOpen] = useState(false);
    const [gameInfoAnchorElement, setGameInfoAnchorElement] = React.useState<HTMLElement | null>(null);
    const gameInfoOpen = Boolean(gameInfoAnchorElement);

    const handleOpenGameInfo = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setGameInfoAnchorElement(event.currentTarget);
    };

    const handleCloseGameInfo = () => {
        setGameInfoAnchorElement(null);
    };

    const handleSGFBoardSettingsClick = () => {
        setSGFBoardSettingsOpen(true);
    };

    const handleSGFupload = (event: ChangeEvent) => {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) {
            return;
        }
        const file = input.files[0];
        dispatch(uploadSGFFile(file));
    };

    useTimer(1000, sgfState.uploading, () => {
        dispatch(loadProgress());
    });

    const uploadButton = useIconText(<Upload/>, 'Upload');
    
    const infoIcon = useIcon(<Info onClick={handleOpenGameInfo} onMouseEnter={handleOpenGameInfo} onMouseLeave={handleCloseGameInfo}/>);
    const settingsIcon = useIcon(<Config onClick={handleSGFBoardSettingsClick}/>);

    return <React.Fragment>
        <SGFBoardSettings open={sgfBoardSettingsOpen} onClose={() => setSGFBoardSettingsOpen(false)}/>
        <Grid item xs={6} className={classes.statusContainer}>
            {!sgfState.uploading && <input accept=".sgf" className={classes.input} id="icon-button-file" type="file" onChange={(e) => handleSGFupload(e)} />}
            {!sgfState.uploading &&<label htmlFor="icon-button-file">
                {uploadButton}
            </label>}                        
            {sgfState.uploading && <Progress progress={sgfState.analysisProgress.analyzed / sgfState.analysisProgress.total} label={'Analyzing...'}/>}
        </Grid>
        <Grid item xs={6} className={classes.infoContainer}>
            {sgfState.hasSGF && infoIcon}
            {settingsIcon}
            {sgfState.hasSGF && <Popover
                className={classes.popover}
                open={gameInfoOpen}
                anchorEl={gameInfoAnchorElement}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handleCloseGameInfo}
                disableRestoreFocus>
                <SGFData/>
            </Popover>}
        </Grid>
    </React.Fragment>;
}

export default SGFStatusBar;