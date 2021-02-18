import * as React from 'react';

import {Switch} from 'react-router-dom';
import Dashboard from './Dashboard';
import CssBaseline from '@material-ui/core/CssBaseline';

import {createMuiTheme, MuiThemeProvider, responsiveFontSizes} from '@material-ui/core/styles';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {authorize} from 'actions/auth';
import TokenUtils from 'utils/tokenUtils';
import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-park/react';
import { IIconConfig } from '@icon-park/react/lib/runtime';

let theme = createMuiTheme({
    palette: {
        primary: {
            light: '#6E7783',
            main: '#566971',
            dark: '#383A3F',
            contrastText: '#FFFFFF',
        },
        secondary: {
            light: '#EC6A5C',
            main: '#C65146',
            dark: '#AF4034',
            contrastText: '#FFFFFF',
        },
        text: {
            primary: '#000000',
            secondary: '#FFFFF3',
            disabled: '#CCCCCC'
        }
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

    const iconConfig: IIconConfig = {
        ...DEFAULT_ICON_CONFIGS,
        theme: 'outline',
        size: 24
    };

    return (
        <MuiThemeProvider theme={theme}>
            <IconProvider value={iconConfig}>
                <CssBaseline />
                {/*<Navigation/>*/}
                <Switch>
                    <Dashboard/>
                </Switch>
            </IconProvider>
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