import * as React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { ReactElement, ReactNode } from 'react';

const useStyles = makeStyles((theme) => ({
    icon: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        height: '24px',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    disabledIcon: {
        '&:hover': {
            cursor: 'not-allowed'
        }
    },
}));

export default function useIcon(component: ReactNode, disabled = false): ReactElement {
    const classes = useStyles();
    const componentClasses: Array<string> = [];
    componentClasses.push(classes.icon);

    if (disabled) {
        componentClasses.push(classes.disabledIcon);
    }
    
    const color = disabled ? '#cccccc' : '#fffff3';

    const icon = React.Children.map(component, c => {
        if (React.isValidElement(c)) {
            return React.cloneElement(c, {
                theme: 'outline',
                size: 24,
                fill: color,
                className: componentClasses.join(' ')
            });
        }
        return c;
    });
    return <>{icon}</>;
}