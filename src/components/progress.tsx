import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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

interface ProgressProps {
    progress: number
    label: string
}

const Progress: React.FC<ProgressProps> = ({progress, label}) => {
    const classes = useStyles();
    const value = isNaN(progress) ? 0: progress;
    return <React.Fragment>
        <Box className={classes.progressImage} key={`${label}-image`}>
            <CircularProgress size={24} variant="indeterminate" value={value} />
            <Box className={classes.progressValue}>
                <Typography variant="caption" className={classes.progressText}>
                    {`${Math.round(value)}%`}
                </Typography>
            </Box>
        </Box>
        <Typography variant="caption" className={classes.progressLabel}key={`${label}-label`}>
            {label}
        </Typography>
    </React.Fragment>;
}

export default Progress;