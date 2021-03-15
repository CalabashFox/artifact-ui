import React, { useEffect, useRef } from 'react';
import {useSelector} from 'react-redux';
import {GameState, StoreState} from 'models/StoreState';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(() => ({
    logField: {
        width: '100%',
        fontSize: 12
    }
}));

const KatagoLog: React.FC = () => {
    const gameState = useSelector<StoreState, GameState>(state => state.gameState);
    const classes = useStyles();

    const logs = gameState.logs;

    const logContent = logs.length === 0 ? '\n' : logs.map((log) => {
        return `(${log.timestamp}): ${log.text}`;
    }).join('\n');

    const logElement = useRef<HTMLInputElement>();

    useEffect(() => {
        const elem = logElement.current ?? new HTMLInputElement();
        elem.scrollTop = elem.scrollHeight ?? 0;
    }, [logs]);
    
    return <TextField
        inputRef={logElement}
        className={classes.logField}
        label="Katago log"
        multiline
        rows={12}
        value={logContent}
        variant="outlined"
        disabled={true}
        inputProps={{
            readOnly: true
        }}/>;
};

export default KatagoLog;