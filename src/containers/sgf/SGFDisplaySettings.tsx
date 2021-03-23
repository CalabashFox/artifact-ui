import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";

import { setSGFProperties } from "actions/sgf";
import { SGFProperties } from "models/SGF";
import SGFSettingsComponent from "./SGFSettingsComponent";
import CheckboxComponent from "components/form/CheckboxComponent";

const SGFDisplaySettings: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const dispatch = useDispatch();

    const sgfProperty = sgfState.sgfProperties;

    const toggleProperty = (properties: SGFProperties) => {
        dispatch(setSGFProperties(properties));
    }

    return <SGFSettingsComponent label={'Display'}>
        <CheckboxComponent 
            state={sgfProperty.displayRecommendations} 
            handler={() => toggleProperty({...sgfProperty, displayRecommendations: !sgfProperty.displayRecommendations})}
            label={'recommendations'}/>

        <CheckboxComponent 
            state={sgfProperty.displayMoves} 
            handler={() => toggleProperty({...sgfProperty, displayMoves: !sgfProperty.displayMoves})}
            label={'move'}/>

        <CheckboxComponent 
            state={sgfProperty.displayOwnership} 
            handler={() => toggleProperty({...sgfProperty, displayOwnership: !sgfProperty.displayOwnership})}
            label={'ownership'}/>

        <CheckboxComponent 
            state={sgfProperty.displayPolicy} 
            handler={() => toggleProperty({...sgfProperty, displayPolicy: !sgfProperty.displayPolicy})}
            label={'policy'}/>
    </SGFSettingsComponent>;
};

export default SGFDisplaySettings;