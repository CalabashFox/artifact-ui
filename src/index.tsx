import 'assets/style/artifact.less';
import App from './containers/App';
import {createBrowserHistory, History} from 'history';
import {StoreState} from 'models/StoreState';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {routerMiddleware as createRouterMiddleware} from 'react-router-redux';
import {rootReducer} from 'reducers';
import {applyMiddleware, createStore, Store} from 'redux';
import thunk from 'redux-thunk';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension';

const history: History = createBrowserHistory();
export const routerMiddleware = createRouterMiddleware(history);

export function configureStore(initialState: StoreState): Store<StoreState> {
    const middlewares = [thunk, routerMiddleware];
    const enhancer = composeWithDevTools(applyMiddleware(...middlewares));

    return createStore(rootReducer, initialState, enhancer);
}

const store = configureStore({
    sgfState: {
        analyzedSGF: undefined,
        analysisProgress: undefined,
        error: null,
        sgfProperties: {
            currentMove: 0,
            displayOwnership: true,
            displayPolicy: true,
            displayMoves: true
        },
        uploading: false
    },
    authState: {
        user: null,
        isLoading: false,
        error: null,
        auth: null
    },
});


ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);