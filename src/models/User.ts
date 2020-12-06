export enum Rank {
    P9
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