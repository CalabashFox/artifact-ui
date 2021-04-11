import React from 'react';
import {useSelector} from 'react-redux';
import {GameState, StoreState} from 'models/StoreState';
import FoldableTextContainer from 'containers/FoldableTextContainer';
import { useTranslation } from 'react-i18next';

const KatagoLog: React.FC = () => {
    const gameState = useSelector<StoreState, GameState>(state => state.gameState);
    const { t } = useTranslation();
    
    const logContent = gameState.logs.length === 0 ? '\n' : gameState.logs.map((log) => {
        return `(${log.timestamp}): ${log.text}`;
    }).join('\n');
    
    return <FoldableTextContainer 
        label={t('ui.sgf.katagoLog')}
        text={logContent}
        rows={12}
        collapsable={true}/>;
};

export default KatagoLog;