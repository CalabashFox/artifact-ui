import React from "react";
import {makeStyles} from '@material-ui/core/styles';

import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles(() => ({
    legend: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '50px'
    }
}));

interface ComponentsProps {
    label: string
    children: React.ReactNode
}

const SGFSettingsComponent: React.FC<ComponentsProps> = ({label, children}) => {
    const classes = useStyles();

    return <FormGroup row>
        <FormLabel component="label" className={classes.legend}>{label}</FormLabel>
        {children}
    </FormGroup>;
};

export default SGFSettingsComponent;