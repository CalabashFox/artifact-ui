import {useSelector} from "react-redux";
import {StoreState, ViewState} from "models/StoreState";
import { useMemo } from "react";
import { SocketConnectionState } from "models/view";

interface ConnectionState {
    connected: boolean
    state: SocketConnectionState
}

const useConnectionState = (): ConnectionState => {
    const viewState = useSelector<StoreState, ViewState>(state => state.viewState);

    return useMemo(() => {
        return { 
            connected: viewState.socketConnectionState === SocketConnectionState.CONNECTED,
            state: viewState.socketConnectionState
        };
    }, [viewState]);
}
export default useConnectionState;