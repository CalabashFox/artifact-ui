import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ReactElement } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(() => ({
    progressLabel: {
        paddingLeft: '5px',
        display: 'inline-flex',
        verticalAlign: 'middle',
        lineHeight: '24px'
    },
    progressValue: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    progressImage: {
        position: 'relative',
        display: 'inline-flex',
        verticalAlign: 'middle',
        lineHeight: '24px'
    },
    progressText: {
        fontSize: '.8em'
    }
}));

export default function useProgress(progress: number, label: string): Array<ReactElement> {
    const classes = useStyles();
    return [
        <Box className={classes.progressImage} key={`${label}-image`}>
            <CircularProgress size={24} variant="indeterminate" value={progress} />
            <Box className={classes.progressValue}>
                <Typography variant="caption" className={classes.progressText}>
                    {`${Math.round(progress)}%`}
                </Typography>
            </Box>
        </Box>,
        <Typography variant="caption" className={classes.progressLabel}key={`${label}-label`}>
            {label}
        </Typography>
    ];
}