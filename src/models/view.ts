export const TAB_VIEW_IMAGE = 0;
export const TAB_VIEW_GAME = 1;
export const TAB_VIEW_SGF = 2;

export enum SocketConnectionState {
    IDLE = 'idle', 
    CANNOT_CONNECT = 'cannotConnect', 
    CONNECTING = 'connecting', 
    CONNECTED = 'connected', 
    DISCONNECTED = 'disconnected'
}

export const InitialViewState = {
    infoWidth: 0,
    screenWidth: 0,
    tab: TAB_VIEW_SGF,
    loading: false,
    loadingText: '',
    socketConnectionState: SocketConnectionState.IDLE
}