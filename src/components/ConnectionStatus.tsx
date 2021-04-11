import React from 'react';
import {useSelector} from 'react-redux';
import {StoreState, ViewState} from 'models/StoreState';
import {LinkCloudFaild, LinkCloudSucess, LinkCloud} from '@icon-park/react';
import useIconText from './hook/iconText';
import { SocketConnectionState } from 'models/view';
import { useTranslation } from 'react-i18next';

const ConnectionStatus: React.FC = () => {
    const viewState = useSelector<StoreState, ViewState>(state => state.viewState);
    const state = viewState.socketConnectionState;
    const { t } = useTranslation();

    const connectingIcon = useIconText(<LinkCloud/>, t('ui.sgf.' + state));
    const connnectedIcon = useIconText(<LinkCloudSucess/>, t('ui.sgf.' + state));
    const cannotConnectIcon = useIconText(<LinkCloudFaild/>, t('ui.sgf.' + state));
    return <React.Fragment>
        {(state === SocketConnectionState.IDLE || state === SocketConnectionState.CONNECTING) && connectingIcon}
        {state === SocketConnectionState.CONNECTED && connnectedIcon}
        {(state === SocketConnectionState.CANNOT_CONNECT || state === SocketConnectionState.DISCONNECTED) && cannotConnectIcon}
        </React.Fragment>;
};

export default ConnectionStatus;