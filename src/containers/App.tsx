import * as React from 'react';

import { Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import CssBaseline from '@material-ui/core/CssBaseline';

import { createMuiTheme, MuiThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authorize } from 'actions/auth';
import TokenUtils from 'utils/tokenUtils';
import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-park/react';
import { IIconConfig } from '@icon-park/react/lib/runtime';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';

const breakpoints = createBreakpoints({});

const defaultTheme = createMuiTheme({
    palette: {
        primary: {
            light: '#6E7783',
            main: '#566971',
            dark: '#383A3F',
            contrastText: '#FFFFF3',
        },
        secondary: {
            light: '#EC6A5C',
            main: '#C65146',
            dark: '#AF4034',
            contrastText: '#FFFFF3',
        },
        text: {
            primary: '#FFFFF3',
            secondary: '#FFFFF3',
            disabled: '#CCCCCC'
        },
        common: {
            white: '#FFFFF3',
            black: '#000000'
        }
    },
});

let theme = createMuiTheme({
    palette: defaultTheme.palette,
    typography: {
        fontSize: 12,
        fontFamily: ["Lucida Grande", "Tahoma", "Verdana", "Arial", "sans-serif"].join(','),
    },
    overrides: {
        MuiInputLabel: {
            root: {
                '&.Mui-disabled': {
                    color: defaultTheme.palette.text.primary
                },
                "&$focused": {
                    color: defaultTheme.palette.text.primary
                }
            },
            focused: {}
        },
        MuiOutlinedInput: {
            root: {
                '&.Mui-disabled': {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: defaultTheme.palette.text.primary,
                        "&$focused": {
                            borderColor: defaultTheme.palette.text.primary
                        }
                    }
                },
            }
        },
        MuiInputBase: {
            root: {
                '&.Mui-disabled': {
                    color: defaultTheme.palette.text.primary
                }
            }
        },
        MuiFormLabel: {
            root: {
                "&$focused": {
                    color: defaultTheme.palette.text.primary
                }
            },
            focused: {}
        },
        MuiTabs: {
            indicator: {
                backgroundColor: 'transparent'
            },
            root: {
                height: '30px',
                minHeight: '30px'
            }
        },
        MuiTab: {
            root: {
                [breakpoints.up('sm')]: {
                    minWidth: 'unset'
                },
                height: '30px',
                minHeight: '30px',
                "&:hover": {
                    backgroundColor: defaultTheme.palette.text.primary,
                    color: defaultTheme.palette.primary.main
                }
            },
            selected: {
                backgroundColor: defaultTheme.palette.text.primary,
                color: defaultTheme.palette.primary.main
            }
        },
        MuiBottomNavigation: {
            root: {
                height: '40px'
            }
        },
        MuiBottomNavigationAction: {
            root: {
                color: defaultTheme.palette.text.primary,
                boxSizing: 'border-box',
                "&:hover": {
                    backgroundColor: defaultTheme.palette.text.primary,
                    color: defaultTheme.palette.primary.main
                }
            },
            selected: {
                backgroundColor: defaultTheme.palette.text.primary,
                color: defaultTheme.palette.primary.main
            }
        },
        MuiSelect: {
            root: {
                color: defaultTheme.palette.primary.main
            }
        },
        MuiMenuItem: {
            root: {
                color: defaultTheme.palette.primary.main
            }
        },
        MuiCircularProgress: {
            colorPrimary: {
                color: defaultTheme.palette.text.primary
            }
        },
        MuiDivider: {
            root: {
                color: defaultTheme.palette.text.primary,
                margin: 0
            }
        },
        MuiPaper: {
            root: {
                padding: defaultTheme.spacing(1),
                textAlign: 'center',
                boxSizing: 'border-box',
                color: defaultTheme.palette.text.primary,
                margin: defaultTheme.spacing(0.5, 0),
                backgroundColor: defaultTheme.palette.primary.main,
                '&.MuiPaper-rounded': {
                    borderRadius: 0
                },
                [breakpoints.down('xs')]: {
                    margin: 0,
                    borderRadius: 0
                }
            }
        },
        MuiContainer: {
            root: {
                paddingLeft: 0,
                paddingRight: 0,
                [breakpoints.up('sm')]: {
                    paddingLeft: 0,
                    paddingRight: 0
                }
            }
        },
        MuiFormControlLabel: {
            root: {
                marginLeft: 0,
                marginRight: 0
            }
        },
        MuiCheckbox: {
            colorPrimary: {
                color: defaultTheme.palette.text.primary,
                '&$checked': {
                    color: defaultTheme.palette.text.primary
                }
            },
            root: {
                padding: defaultTheme.spacing(0, 0.5)
            }
        }
    },
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
                    <Dashboard />
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