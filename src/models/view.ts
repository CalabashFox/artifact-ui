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
const isMobile = () => {
    return /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent);
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