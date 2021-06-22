import React, { useState, Dispatch, SetStateAction } from 'react';
import { useDispatch} from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { startGame } from 'actions/game';

const useStyles = makeStyles((theme: Theme) => ({
    dialogTitle: {
        width: 300
    },
    formContainer: {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.text.primary,
        boxSizing: 'border-box',
        textAlign: 'left'
    },
    select: {
        width: 50
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        lineHeight: '40px'
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
    },
    radio: {
        '&$checked': {
            color: theme.palette.primary.main
        },
        color: theme.palette.primary.main
    },
    checked: {},
    button: {
        color: theme.palette.text.primary
    }
}));

export interface GameSettingsDialogProps {
    open: boolean
    onClose: () => void
}

const TYPE_HUMAN = 0;
const TYPE_AI = 1;

const GameSettingsDialog: React.FC<GameSettingsDialogProps> = ({ open, onClose }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();


    const [dimension, setDimension] = useState(19);
    const [player1Type, setPlayer1Type] = useState(TYPE_HUMAN);
    const [player2Type, setPlayer2Type] = useState(TYPE_AI);

    const handleClose = () => {
        onClose();
    };

    const handleStartGame = () => {
        dispatch(startGame(player1Type === TYPE_HUMAN, player2Type === TYPE_HUMAN, dimension));
        onClose();
    };

    const togglePlayer1Type = (type: number) => {
        setPlayer1Type(type);
        
        if (type === TYPE_AI && player2Type === TYPE_AI) {
            setPlayer2Type(TYPE_HUMAN);
        }
    };

    const togglePlayer2Type = (type: number) => {
        setPlayer2Type(type);
        
        if (player1Type === TYPE_AI && type === TYPE_AI) {
            setPlayer1Type(TYPE_HUMAN);
        }
    }

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>, setter: (type: number) => void) => {
        setter(parseInt((event.target as HTMLInputElement).value));
        console.log((event.target as HTMLInputElement).value);
    };

    const handleSelectChange = (value: string, setter: Dispatch<SetStateAction<number>>) => {
        setter(parseInt(value));
    };

    return <React.Fragment>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle className={classes.dialogTitle}>{t('ui.game.settings.title')}</DialogTitle>
            <DialogContent>
                <Grid container className={classes.formContainer}>

                    <Grid item xs={4} className={classes.formLabel}>
                        <Typography variant="subtitle1" className={classes.title}>{t('ui.game.settings.player1')}</Typography>
                    </Grid>
                    <Grid item xs={8} className={classes.formInput}>
                        <FormControl>
                            <RadioGroup name="player1" value={player1Type} onChange={(e) => handleRadioChange(e, togglePlayer1Type)}>
                                <FormControlLabel value={TYPE_HUMAN} control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />} label={t('ui.game.settings.human')} />
                                <FormControlLabel value={TYPE_AI} control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />} label={t('ui.game.settings.ai')} />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container className={classes.formContainer}>

                    <Grid item xs={4} className={classes.formLabel}>
                        <Typography variant="subtitle1" className={classes.title}>{t('ui.game.settings.player2')}</Typography>
                    </Grid>
                    <Grid item xs={8} className={classes.formInput}>
                        <FormControl>
                            <RadioGroup name="player2" value={player2Type} onChange={(e) => handleRadioChange(e, togglePlayer2Type)}>
                                <FormControlLabel value={TYPE_HUMAN} control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />} label={t('ui.game.settings.human')} />
                                <FormControlLabel value={TYPE_AI} control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />} label={t('ui.game.settings.ai')} />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container className={classes.formContainer}>

                    <Grid item xs={4} className={classes.formLabel}>
                        <Typography variant="subtitle1" className={classes.title}>{t('ui.game.settings.dimension')}</Typography>
                    </Grid>
                    <Grid item xs={8} className={classes.formInput}>
                        <FormControl>
                            <Select
                                className={classes.select}
                                value={dimension}
                                onChange={(e) => handleSelectChange(e.target.value as string, setDimension)}>
                                <MenuItem key={9} value={9}>9</MenuItem>
                                <MenuItem key={13} value={13}>13</MenuItem>
                                <MenuItem key={19} value={19}>19</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleStartGame} className={classes.button}>
                    {t('ui.game.settings.start')}
                </Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
}
export default GameSettingsDialog;