import React from 'react';
import {useSelector} from 'react-redux';
import {GameState, StoreState} from 'models/StoreState';
import FoldableTextContainer from 'containers/FoldableTextContainer';

const SelectComponent: React.FC = () => {
    const gameState = useSelector<StoreState, GameState>(state => state.gameState);

    const logContent = gameState.logs.length === 0 ? '\n' : gameState.logs.map((log) => {
        return `(${log.timestamp}): ${log.text}`;
    }).join('\n');
    
    return <FoldableTextContainer 
        label={'Katago log'}
        text={logContent}
        rows={12}
        collapsable={true}/>;
};

export default SelectComponent;