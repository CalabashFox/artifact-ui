import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";
import {makeStyles, Theme} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { SGFColor } from 'models/SGF';
import { Grid, Typography } from '@material-ui/core';
import blackIcon from 'assets/images/black.svg';
import whiteIcon from 'assets/images/white.svg';
import useOwnership from "components/hook/ownership";
import useMoveColor from "components/hook/moveColor";
import { useTranslation } from 'react-i18next';
import usePlayerTitle from "components/hook/playerTitle";

const useStyles = makeStyles((theme: Theme) => ({
    playerTitle: {
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: theme.spacing(0.5)
    },
    playerStoneImage: {
        width: '18px',
        height: '18px',
        display: 'inline-block',
        verticalAlign: 'middle',
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    },
    columnsLeft: {
        textAlign: 'left'
    },
    columnsRight: {
        textAlign: 'right'
    },
    komi: {
        lineHeight: 1,
        fontSize: '.7rem'
    }
}));

const SGFTerritoryInfo: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const { t } = useTranslation();
    const ownership = useOwnership();
    const color = useMoveColor();
    const [playerBlack, playerWhite] = usePlayerTitle();

    const [black, white, diff] = useMemo(() => {
        let black = 0;
        let white = 0;
        ownership.forEach((v) => {
            const value = Math.abs(v);
            if (value < sgfState.sgfProperties.minimumOwnershipValue) {
                return;
            }
            if (color === SGFColor.BLACK) {
                if (v < 0) {
                    white++;
                } else {
                    black++;
                }
            } else if (color === SGFColor.WHITE) {
                if (v < 0) {
                    black++;
                } else {
                    white++;
                }
            }
        });
        return [black, white, black - white - sgfState.analyzedSGF.komi];
    }, [ownership, color, sgfState.sgfProperties.minimumOwnershipValue, sgfState.analyzedSGF]);

    return <React.Fragment>
        <Grid container>
            <Grid item xs={5} className={classes.columnsLeft}>
                <Box>
                    <img src={blackIcon} className={classes.playerStoneImage} alt={'black'}/>
                    <Typography className={classes.playerTitle} noWrap>{playerBlack}</Typography>
                </Box>
                <Box>
                    <img src={whiteIcon} className={classes.playerStoneImage} alt={'white'}/>
                    <Typography className={classes.playerTitle} noWrap>{playerWhite}</Typography>
                </Box>
            </Grid>
            <Grid item xs={2} className={classes.columnsLeft}>
                <Typography noWrap>{black}</Typography>
                <Typography noWrap>{white}</Typography>
            </Grid>
            <Grid item xs={5} className={classes.columnsRight}>
                <Typography variant='h6' noWrap>
                    {diff > 0 ? t('ui.sgf.blackLead') : t('ui.sgf.whiteLead')} {Math.abs(diff)} {t('ui.sgf.points')}
                </Typography>
                <Typography noWrap className={classes.komi}>
                    {t('ui.sgf.komi')} {sgfState.analyzedSGF.komi}
                </Typography>
            </Grid>
        </Grid>
    </React.Fragment>;
}

export default SGFTerritoryInfo;