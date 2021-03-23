import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";

import { setSGFProperties, toggleLiveMode } from "actions/sgf";
import { SGFProperties } from "models/SGF";
import CheckboxComponent from "components/form/CheckboxComponent";
import SGFSettingsComponent from "./SGFSettingsComponent";


const SGFModeSettings: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const dispatch = useDispatch();

    const sgfProperty = sgfState.sgfProperties;

    const handleLiveModeClick = () => {
        dispatch(toggleLiveMode(!sgfProperty.liveMode, sgfProperty.currentMove));
    };

    const toggleProperty = (properties: SGFProperties) => {
        dispatch(setSGFProperties(properties));
    }

    return <SGFSettingsComponent label={'Mode'}>
        <CheckboxComponent 
            state={sgfProperty.editMode} 
            handler={() => toggleProperty({...sgfProperty, editMode: !sgfProperty.editMode})}
            label={'Edit mode'}/>

        <CheckboxComponent 
            state={sgfProperty.liveMode} 
            handler={handleLiveModeClick}
            label={'Live mode'}/>
    </SGFSettingsComponent>;
};

export default SGFModeSettings;