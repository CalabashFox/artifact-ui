import React, {ReactElement} from "react";
import {useSelector} from "react-redux";
import {Redirect, Route, RouteChildrenProps} from "react-router";
import {AuthState, StoreState} from "models/StoreState";
import {emptyValue} from 'utils/commons';
import Loading from '../pages/Loading';

interface AuthProps {
    path?: string;
    auth: string;
    exact?: boolean;
    children?: ((props: RouteChildrenProps<never>) => React.ReactNode) | React.ReactNode;
}

export default function AuthRoute(props: AuthProps): ReactElement {
    const authState = useSelector<StoreState, AuthState>(state => state.authState);
    const { auth } = props;
    const authorized = !emptyValue(authState.auth);
    if (authState.isLoading) {
        return <Loading/>;
    } else if (auth === "unauthorized" && authorized) {
        return <Redirect to="/dashboard" />;
    } else if (auth === "authorized" && !authorized) {
        return <Redirect to="/" />;
    } else {
        return <Route {...props} />;
    }
}