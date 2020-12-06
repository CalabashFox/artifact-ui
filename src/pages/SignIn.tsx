import React, {ReactElement, useState} from "react";
import {login, setAuthError} from "actions/auth";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Alert, {AlertProps} from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {AuthState, StoreState} from "models/StoreState";

import {useDispatch, useSelector} from "react-redux";
import {emptyValue} from 'utils/commons';

import {ReactComponent as ArtifactIcon} from 'assets/images/icon.svg';
import {SvgIcon} from '@material-ui/core';

function ErrorAlert(props: AlertProps) {
    return <Alert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn(): ReactElement {
    const classes = useStyles();
    const authState = useSelector<StoreState, AuthState>(state => state.authState);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const dispatch = useDispatch();

    const toggleRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
    };

    const submitForm = () => {
        if (emptyValue(email) || emptyValue(password)) {
            dispatch(setAuthError('Fields are required'));
            return;
        }
        dispatch(setAuthError(null));
        dispatch(login(email, password, rememberMe));
    };

    return (
        <Container component="main" maxWidth="xs">

            {authState.error !== null && (
                <ErrorAlert severity="error" onClick={() => dispatch(setAuthError(null))}>
                    {authState.error}
                </ErrorAlert>
            )}

            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <SvgIcon component={ArtifactIcon} viewBox="0 0 980 980" />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    <FormControlLabel
                        control={<Checkbox value="true" color="primary" checked={rememberMe} onChange={toggleRememberMe}/>}
                        label="Remember me"
                    />
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={submitForm}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}