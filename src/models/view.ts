export const TAB_VIEW_IMAGE = 0;
export const TAB_VIEW_GAME = 1;
export const TAB_VIEW_SGF = 2;
export const TAB_VIEW_RECORDING = 3;
export const TAB_VIEW_MONITOR = 4;

export enum SocketConnectionState {
    IDLE = 'idle', 
    CANNOT_CONNECT = 'cannotConnect', 
    CONNECTING = 'connecting', 
    CONNECTED = 'connected', 
    DISCONNECTED = 'disconnected'
}

const tabQuery = (): number => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabValue = searchParams.get('tab');
    return tabValue === null ? 0 : parseInt(tabValue);
};

export const InitialViewState = {
    infoWidth: 0,
    screenWidth: 0,
    //tab: isMobile() ? TAB_VIEW_RECORDING : TAB_VIEW_MONITOR,
    tab: tabQuery(),
    loading: false,
    loadingText: '',
    socketConnectionState: SocketConnectionState.IDLE
}