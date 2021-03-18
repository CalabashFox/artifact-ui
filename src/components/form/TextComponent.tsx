import React, { useEffect, useRef } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(() => ({
    logField: {
        width: '100%',
        fontSize: 12
    }
}));

interface TextComponentProps {
    label: string
    text: string
    rows: number
}

const TextComponent: React.FC<TextComponentProps> = ({label, text, rows}) => {
    const classes = useStyles();
    const logElement = useRef<HTMLInputElement>();
    const useLabel = label === '' ? {} : { label: label };

    useEffect(() => {
        const elem = logElement.current ?? new HTMLInputElement();
        elem.scrollTop = elem.scrollHeight ?? 0;
    }, [text]);

    return <TextField
        {...useLabel}
        inputRef={logElement}
        className={classes.logField}
        multiline
        rows={rows}
        value={text}
        variant="outlined"
        disabled={true}
        inputProps={{
            readOnly: true
        }}/>;
};

export default TextComponent;