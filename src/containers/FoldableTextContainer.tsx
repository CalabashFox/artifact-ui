import React, { useState } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import {Up, Down} from '@icon-park/react';
import useIcon from "components/hook/icon";
import Grid from '@material-ui/core/Grid';
import TextComponent from 'components/form/TextComponent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    container: {
        height: '24px'
    },
    title: {
        textAlign: 'left',
        boxSizing: 'border-box',
        paddingLeft: theme.spacing(1)
    },
    icon: {
        textAlign: 'right'
    }
}));


interface FoldableTextContainerProps {
    label: string
    text: string
    rows: number
    collapsable: boolean
}

const FoldableTextContainer: React.FC<FoldableTextContainerProps> = ({label, text, rows, collapsable}) => {    
    const classes = useStyles();
    const [expanded, setExpanded] = useState(true);

    const expandIcon = useIcon(<Down onClick={() => setExpanded(true)}/>);
    const collapseIcon = useIcon(<Up onClick={() => setExpanded(false)}/>);

    if (collapsable) {
        return <React.Fragment>
            <Grid container justify="flex-end" className={classes.container}>
                <Grid item xs={9} className={classes.title}>
                    <Typography variant="subtitle1">
                        {label}
                    </Typography>
                </Grid>
                <Grid item xs={3} className={classes.icon}>
                    {expanded && collapseIcon}
                    {!expanded && expandIcon}
                </Grid>
            </Grid>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <TextComponent label={''} text={text} rows={rows}/>
            </Collapse>
        </React.Fragment>;
    } else {
        return <Grid container>
            <TextComponent label={label} text={text} rows={rows}/>
        </Grid>;
    }
};

export default FoldableTextContainer;