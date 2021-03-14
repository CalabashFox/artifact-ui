export enum Rank {
    P9, P8, P7, P6, L9, L8, L18
}

export enum UserState {
    IN_GAME, IDLE
}

export interface User {
    userName: string;
    email: string;
    rank: Rank;
    state: UserState,
    token: string;
}

export const InitialAuthState = {
    user: null,
    isLoading: false,
    error: null,
    auth: null
}