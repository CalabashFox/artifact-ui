import React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { SGFColor } from 'models/SGF';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
    blackStatus: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.text.primary
    },
    whiteStatus: {
        color: theme.palette.common.black,
        backgroundColor: theme.palette.text.primary
    },
}));

interface WinrateStatusProps {
    color: SGFColor
    winrate: number
    winrateDiff: number
}

const WinrateStatus: React.FC<WinrateStatusProps> = ({ color, winrate, winrateDiff}) => {
    const classes = useStyles();

    const statusClass = color === SGFColor.BLACK ? classes.blackStatus : classes.whiteStatus;

    return <Box display="inline-block" width={winrate + '%'} style={{minWidth: '10%'}}>
        <Typography variant="caption" align="center" className={statusClass} display="block" noWrap>
        {winrate.toFixed(1) + '%'} {winrateDiff > 0 ? '(+' + winrateDiff.toFixed(1) + '%)' : ''}
        </Typography>
    </Box>;
}

export default WinrateStatus;