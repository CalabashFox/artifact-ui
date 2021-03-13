
import React, { useState, ReactElement, Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SGFState, StoreState } from 'models/StoreState';
import { withStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';

import Switch from '@material-ui/core/Switch';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { MovePriority, WinrateReport } from 'models/SGF';
import Slider from '@material-ui/core/Slider';
import { setSGFProperties } from 'actions/sgf';

const useStyles = makeStyles((theme: Theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    formContainer: {
        color: theme.palette.primary.main,
        padding: theme.spacing(2),
        textAlign: 'left'
    },
    select: {
        minWidth: 120,
        maxWidth: 120
    },
    slider: {
        width: 120
    },
    formLabel: {
        textAlign: 'left',
        lineHeight: '40px'
    },
    formInput: {
        textAlign: 'right',
        paddingRight: theme.spacing(1),
        lineHeight: '40px'
    }
}));

const SettingsSlider = withStyles({
    valueLabel: {
        left: 'calc(-50% + 12px)',
        top: -22,
        '& *': {
            background: 'transparent',
            color: '#000',
        },
    }
})(Slider);

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export interface SGFBoardSettingsProps {
    open: boolean
    onClose: () => void
}

function generateIntOptions(begin: number, end: number): Array<ReactElement> {
    const array = new Array<ReactElement>();
    for (let i = begin; i <= end; i++) {
        array.push(<MenuItem value={i}>{i}</MenuItem>);
    }
    return array;
}

type enums = typeof MovePriority | typeof WinrateReport;

type EnumTuple = {
    type: enums
    value: number
    label: string
};

function getEnumTuples(e: enums): Array<EnumTuple> {
    const array = new Array<EnumTuple>();
    for (const v in e) {
        const index = parseInt(v);
        if (!isNaN(index)) {
            array.push({
                type: e,
                value: index,
                label: Object.values(e)[index]
            });
        }
    }
    return array;
}

function generateEnumOptions(array: Array<EnumTuple>) {
    return array.map(e => <MenuItem key={e.label} value={e.value}>{e.label}</MenuItem>);
}

const movePriorities = getEnumTuples(MovePriority);
const winrateReports = getEnumTuples(WinrateReport);

export default function SGFBoardSettings(props: SGFBoardSettingsProps): ReactElement {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const classes = useStyles();
    const dispatch = useDispatch();

    const { open, onClose } = props;
    const sgfProperties = sgfState.sgfProperties;

    const [displayOwnership, setDisplayOwnership] = useState(sgfProperties.displayOwnership);
    const [displayMoves, setDisplayMoves] = useState(sgfProperties.displayMoves);
    const [displayPolicy, setDisplayPolicy] = useState(sgfProperties.displayPolicy);
    const [useSound, setUseSound] = useState(sgfProperties.useSound);
    const [movePriority, setMovePriority] = useState(sgfProperties.movePriority);
    const [minimumPolicyValue, setMinimumPolicyValue] = useState(sgfProperties.minimumPolicyValue);
    const [minimumOwnershipValue, setMinimumOwnershipValue] = useState(sgfProperties.minimumOwnershipValue);
    const [reportAnalysisWinratesAs, setReportAnalysisWinratesAs] = useState(sgfProperties.reportAnalysisWinratesAs);
    const [topMatch, setTopMatch] = useState(sgfProperties.topMatch);

    const handleClose = () => {
        onClose();
    };

    const handleSave = () => {
        const properties = {
            ...sgfState.sgfProperties,
            displayOwnership: displayOwnership,
            displayMoves: displayMoves,
            displayPolicy: displayPolicy,
            movePriority: movePriority,
            useSound: useSound,
            minimumPolicyValue: minimumPolicyValue,
            displayOwnersminimumPolicyValuehip: minimumPolicyValue,
            minimumOwnershipValue: minimumOwnershipValue,
            topMatch: topMatch,
        };        if (topMatch !== sgfProperties.topMatch) {
            // recalculate
        }
        dispatch(setSGFProperties(properties));
        onClose();
    };

    const handleSliderChange = (event: React.ChangeEvent<Record<string, unknown>>, value: number | number[], setter: Dispatch<SetStateAction<number>>) => {
        setter(value as number);
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>, setter: Dispatch<SetStateAction<boolean>>) => {
        setter(event.target.checked);
    };

    const handleSelectChange = (value: string, setter: Dispatch<SetStateAction<number>>) => {
        setter(parseInt(value));
    };

    const sliderValueText = (value: number) => {
        return `${value}`;
    };

    return <div>
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="subtitle1" className={classes.title}>SGF Settings</Typography>
                    <Button color="inherit" onClick={handleSave}>save</Button>
                </Toolbar>
            </AppBar>
            <Grid container className={classes.formContainer}>

                <Grid item xs={9} className={classes.formLabel}>
                        <Typography variant="subtitle1" className={classes.title}>Use sound</Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.formInput}>
                        <Switch
                            checked={useSound}
                            onChange={(e) => handleSwitchChange(e, setUseSound)}
                            color="primary" />
                </Grid>

                <Grid item xs={9} className={classes.formLabel}>
                    <Typography variant="subtitle1" className={classes.title}>Display ownership</Typography>
                </Grid>
                <Grid item xs={3} className={classes.formInput}>
                    <Switch
                        checked={displayOwnership}
                        onChange={(e) => handleSwitchChange(e, setDisplayOwnership)}
                        color="primary" />
                </Grid>

                <Grid item xs={9} className={classes.formLabel}>
                    <Typography variant="subtitle1" className={classes.title}>Display moves</Typography>
                </Grid>
                <Grid item xs={3} className={classes.formInput}>
                    <Switch
                        checked={displayMoves}
                        onChange={(e) => handleSwitchChange(e, setDisplayMoves)}
                        color="primary" />
                </Grid>

                <Grid item xs={9} className={classes.formLabel}>
                    <Typography variant="subtitle1" className={classes.title}>Display policy</Typography>
                </Grid>
                <Grid item xs={3} className={classes.formInput}>
                    <Switch
                        checked={displayPolicy}
                        onChange={(e) => handleSwitchChange(e, setDisplayPolicy)}
                        color="primary" />
                </Grid>

                <Grid item xs={7} className={classes.formLabel}>
                    <Typography variant="subtitle1" className={classes.title}>Minumum policy value</Typography>
                </Grid>
                <Grid item xs={5} className={classes.formInput}>
                    <FormControl>
                        <SettingsSlider
                            className={classes.slider}
                            value={minimumPolicyValue}
                            step={0.01}
                            min={0}
                            max={1}
                            onChange={(e, v) => handleSliderChange(e, v, setMinimumPolicyValue)}
                            getAriaValueText={sliderValueText}
                            valueLabelDisplay="on" />
                    </FormControl>
                </Grid>

                <Grid item xs={7} className={classes.formLabel}>
                    <Typography variant="subtitle1" className={classes.title}>Minumum ownership value</Typography>
                </Grid>
                <Grid item xs={5} className={classes.formInput}>
                    <FormControl>
                        <SettingsSlider
                            className={classes.slider}
                            value={minimumOwnershipValue}
                            step={0.01}
                            min={0}
                            max={1}
                            onChange={(e, v) => handleSliderChange(e, v, setMinimumOwnershipValue)}
                            getAriaValueText={sliderValueText}
                            valueLabelDisplay="on" />
                    </FormControl>
                </Grid>

                <Grid item xs={7} className={classes.formLabel}>
                    <Typography variant="subtitle1" className={classes.title}>Display top N moves</Typography>
                </Grid>
                <Grid item xs={5} className={classes.formInput}>
                    <FormControl>
                        <Select
                            className={classes.select}
                            value={topMatch}
                            onChange={(e) => handleSelectChange(e.target.value as string, setTopMatch)}>
                            {generateIntOptions(2, 15)}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={7} className={classes.formLabel}>
                    <Typography variant="subtitle1" className={classes.title}>Prioritize top moves by</Typography>
                </Grid>
                <Grid item xs={5} className={classes.formInput}>
                    <FormControl>
                        <Select
                            className={classes.select}
                            value={movePriority}
                            onChange={(e) => handleSelectChange(e.target.value as string, setMovePriority)}>
                            {generateEnumOptions(movePriorities)}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={7} className={classes.formLabel}>
                    <Typography variant="subtitle1" className={classes.title}>Report analysis winrate as</Typography>
                </Grid>
                <Grid item xs={5} className={classes.formInput}>
                    <FormControl>
                        <Select
                            className={classes.select}
                            value={reportAnalysisWinratesAs}
                            onChange={(e) => handleSelectChange(e.target.value as string, setReportAnalysisWinratesAs)}>
                            {generateEnumOptions(winrateReports)}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Dialog>
    </div>;
}