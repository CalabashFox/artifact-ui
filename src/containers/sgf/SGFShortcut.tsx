import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {SGFState, StoreState} from "models/StoreState";

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { toggleLiveMode } from "actions/sgf";

const SGFShortcut: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const dispatch = useDispatch();

    const handleLiveModeClick = () => {
        dispatch(toggleLiveMode(!sgfState.sgfProperties.liveMode, sgfState.sgfProperties.currentMove));
    };

    return <FormGroup row>
        <FormControlLabel
            control={<Checkbox checked={sgfState.sgfProperties.liveMode} onChange={handleLiveModeClick} color="primary"/>}
            label="Live mode"/>
    </FormGroup>;
}

export default SGFShortcut;