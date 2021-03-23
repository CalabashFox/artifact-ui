import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

interface ComponentProps {
    state: boolean
    handler: () => void
    label: string
}

const CheckboxComponent: React.FC<ComponentProps> = ({state, handler, label}) => {
    return <FormControlLabel
        control={<Checkbox checked={state} onChange={handler} color="primary"/>}
        label={label}/>;
};

export default CheckboxComponent;