import React, { useState } from 'react';
import Collapse from '@material-ui/core/Collapse';
import {Up, Down} from '@icon-park/react';
import useIcon from "components/icon";
import Grid from '@material-ui/core/Grid';
import TextComponent from 'components/TextComponent';

interface FoldableTextContainerProps {
    label: string
    text: string
    rows: number
    collapsable: boolean
}

const FoldableTextContainer: React.FC<FoldableTextContainerProps> = ({label, text, rows, collapsable}) => {    
    const [expanded, setExpanded] = useState(true);

    const expandIcon = useIcon(<Down onClick={() => setExpanded(true)}/>);
    const collapseIcon = useIcon(<Up onClick={() => setExpanded(false)}/>);

    if (collapsable) {
        return <React.Fragment>
            <Grid container justify="flex-end">
                <Grid item xs={9}>
                    {label}
                </Grid>
                <Grid item xs={3}>
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