import * as React from 'react';

import {Switch} from 'react-router-dom';
import Dashboard from './Dashboard';
import Navigation from '../pages/Navigation';
import CssBaseline from '@material-ui/core/CssBaseline';

import {createMuiTheme, MuiThemeProvider, responsiveFontSizes} from '@material-ui/core/styles';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {authorize} from 'actions/auth';
import TokenUtils from 'utils/tokenUtils';

let theme = createMuiTheme({
    palette: {
        primary: {
            light: '#78909c',
            main: '#455a64',
            dark: '#263238',
            contrastText: '#fff',
        },
        secondary: {
            light: '#e57373',
            main: '#e53935',
            dark: '#b71c1c',
            contrastText: '#fff',
        },
    },
    typography: {
        fontSize: 12,
        fontFamily: ["Lucida Grande", "Tahoma", "Verdana", "Arial", "sans-serif"].join(','),
    }
});

theme = responsiveFontSizes(theme);

const App: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (TokenUtils.hasToken()) {
            const auth = TokenUtils.getToken() || '';
            const token = TokenUtils.getRefreshToken() || '';
            dispatch(authorize(auth, token));
        }
    });

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Navigation/>
            <Switch>
                <Dashboard/>
            </Switch>
        </MuiThemeProvider>
    );
};
/*
<AuthRoute path="/dashboard" auth="authorized">
    <Dashboard/>
</AuthRoute>
<AuthRoute path="/my-account" auth="authorized">
    <Account />
</AuthRoute>
<AuthRoute auth="unauthorized">
    <SignIn />
</AuthRoute>
<AuthRoute auth="authorized">
    <Dashboard/>
</AuthRoute>*/

export default App;