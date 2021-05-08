import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";

import { setSGFProperties, toggleLiveMode } from "actions/sgf";
import { SGFProperties } from "models/SGF";
import CheckboxComponent from "components/form/CheckboxComponent";
import SGFSettingsComponent from "./SGFSettingsComponent";
import useConnectionState from "components/hook/connectionState";
import { useTranslation } from 'react-i18next';

const SGFModeSettings: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const { connected } = useConnectionState();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const sgfProperty = sgfState.sgfProperties;

    const handleLiveModeClick = () => {
        dispatch(toggleLiveMode(!sgfProperty.liveMode, sgfState.navigation.index));
    };

    const toggleProperty = (properties: SGFProperties) => {
        dispatch(setSGFProperties(properties));
    }

    return <SGFSettingsComponent label={t('ui.sgf.mode')}>
        <CheckboxComponent 
            state={sgfProperty.editMode} 
            handler={() => toggleProperty({...sgfProperty, editMode: !sgfProperty.editMode})}
            label={t('ui.sgf.editMode')}/>

        {connected && <CheckboxComponent 
            state={sgfProperty.liveMode} 
            handler={handleLiveModeClick}
            label={t('ui.sgf.liveMode')}/>
        }
    </SGFSettingsComponent>;
};

export default SGFModeSettings;