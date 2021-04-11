import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";

import { setSGFProperties } from "actions/sgf";
import { SGFProperties } from "models/SGF";
import SGFSettingsComponent from "./SGFSettingsComponent";
import CheckboxComponent from "components/form/CheckboxComponent";
import { useTranslation } from 'react-i18next';

const SGFDisplaySettings: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const sgfProperty = sgfState.sgfProperties;

    const toggleProperty = (properties: SGFProperties) => {
        dispatch(setSGFProperties(properties));
    }

    return <SGFSettingsComponent label={t('ui.sgf.display')}>
        <CheckboxComponent 
            state={sgfProperty.displayRecommendations} 
            handler={() => toggleProperty({...sgfProperty, displayRecommendations: !sgfProperty.displayRecommendations})}
            label={t('katago.recommendation')}/>

        <CheckboxComponent 
            state={sgfProperty.displayMoves} 
            handler={() => toggleProperty({...sgfProperty, displayMoves: !sgfProperty.displayMoves})}
            label={t('katago.move')}/>

        <CheckboxComponent 
            state={sgfProperty.displayOwnership} 
            handler={() => toggleProperty({...sgfProperty, displayOwnership: !sgfProperty.displayOwnership})}
            label={t('katago.ownership')}/>

        <CheckboxComponent 
            state={sgfProperty.displayPolicy} 
            handler={() => toggleProperty({...sgfProperty, displayPolicy: !sgfProperty.displayPolicy})}
            label={t('katago.policy')}/>
    </SGFSettingsComponent>;
};

export default SGFDisplaySettings;