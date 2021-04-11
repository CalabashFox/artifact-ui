import React, {useState, ChangeEvent, useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import useIconText from 'components/hook/iconText';
import useIcon from 'components/hook/icon';
import useTimer from 'components/hook/timer';
import Progress from 'components/Progress';
import {Upload, Info, Config} from '@icon-park/react'
import Popover from '@material-ui/core/Popover';
import { getAnalyzedSGF, loadProgress, uploading, uploadSGFFile } from 'actions/sgf';
import SGFData from 'components/SGFData';
import SGFBoardSettings from 'components/SGFBoardSettings';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
    container: {
        height: '24px'
    },
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

const SGFModeSettings: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    
    const [sgfBoardSettingsOpen, setSGFBoardSettingsOpen] = useState(false);
    const [gameInfoAnchorElement, setGameInfoAnchorElement] = React.useState<HTMLElement | null>(null);
    const gameInfoOpen = Boolean(gameInfoAnchorElement);

    const handleOpenGameInfo = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setGameInfoAnchorElement(event.currentTarget);
    };

    const handleCloseGameInfo = () => {
        setGameInfoAnchorElement(null);
    };

    const handleSGFupload = (event: ChangeEvent) => {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) {
            return;
        }
        const file = input.files[0];
        dispatch(uploadSGFFile(file));
    };

    const progressFinished = useMemo(() => {
        return sgfState.analysisProgress.total !== 0 && sgfState.analysisProgress.total === sgfState.analysisProgress.analyzed;
    }, [sgfState.analysisProgress.total, sgfState.analysisProgress.analyzed]);

    const terminate = useTimer(1000, sgfState.uploading, () => {
        dispatch(loadProgress());
    });

    useEffect(() => {
        if (progressFinished) {
            dispatch(uploading(false));
            dispatch(getAnalyzedSGF());
            terminate();
        }
    }, [progressFinished, dispatch, terminate]);

    useEffect(() => {
        return () => {
            terminate();
        };
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const uploadButton = useIconText(<Upload/>, t('ui.sgf.upload'));
    
    const infoIcon = useIcon(<Info onClick={handleOpenGameInfo} onMouseEnter={handleOpenGameInfo} onMouseLeave={handleCloseGameInfo}/>);
    const settingsIcon = useIcon(<Config onClick={() => setSGFBoardSettingsOpen(true)}/>);

    return <React.Fragment>
        <SGFBoardSettings open={sgfBoardSettingsOpen} onClose={() => setSGFBoardSettingsOpen(false)}/>
        <Grid container className={classes.container}>
            <Grid item xs={6} className={classes.statusContainer}>
                {!sgfState.uploading && <input accept=".sgf" className={classes.input} id="icon-button-file" type="file" onChange={(e) => handleSGFupload(e)} />}
                {!sgfState.uploading &&<label htmlFor="icon-button-file">
                    {uploadButton}
                </label>}                        
                {sgfState.uploading && <Progress progress={sgfState.analysisProgress.analyzed / sgfState.analysisProgress.total} label={t('ui.sgf.analyzing')}/>}
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
        </Grid>
    </React.Fragment>;
}

export default SGFModeSettings;