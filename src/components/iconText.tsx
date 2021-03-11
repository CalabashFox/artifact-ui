import * as React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { ReactElement, ReactNode } from 'react';
import useIcon from './icon';
import Typography from '@material-ui/core/Typography';
import { Variant } from '@material-ui/core/styles/createTypography';

const useStyles = makeStyles((theme) => ({
    iconText: {
        display: 'inline-block',
        verticalAlign: 'middle',
        lineHeight: '24px',
    },
    iconButton: {
        display: 'inline-flex',
        color: theme.palette.text.primary,
        '&:hover': {
            cursor: 'pointer'
        }
    },
    disabledIconButton: {
        color: theme.palette.text.disabled,
        '&:hover': {
            cursor: 'not-allowed'
        }
    }
}));

export default function useIconText(component: ReactNode, handler: React.MouseEventHandler<HTMLElement>, 
    text: string, variant: Variant = 'body1', disabled = false): ReactElement {
    const classes = useStyles();
    
    const componentClasses: Array<string> = [];
    componentClasses.push(classes.iconButton);

    if (disabled) {
        componentClasses.push(classes.disabledIconButton);
    }

    const icon = useIcon(component, disabled);
    
    return <Typography variant={variant} className={classes.iconButton} onClick={handler}>
        {icon}
        <span className={classes.iconText}>{text}</span>
    </Typography>;
}