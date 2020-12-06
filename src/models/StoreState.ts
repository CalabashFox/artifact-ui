import {Game} from 'models/Game';
import {User} from 'models/User';

export interface StoreState {
    gameState: GameState;
    authState: AuthState;
}

export interface GameState {
    game: Game | null;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    auth: string | null;
}
