import {Game} from 'models/Game';
import {User} from 'models/User';

type NullableString = string | null;

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: NullableString;
    auth: NullableString;
}


export interface StoreState {
    gameState: GameState;
    authState: AuthState;
}

export interface GameState {
    game: Game | null;
}