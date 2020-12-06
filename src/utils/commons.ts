export function emptyValue(value: string | null): boolean {
    return typeof value === undefined || value === '' || value === null;
}

const TOKEN = 'token';
const REFRESH_TOKEN = 'refreshToken';

export default class TokenUtils {

    static getAuthorization(authHeader: string): string {
        return authHeader.replace(/Bearer /g, '');
    }

    static getToken(): string | null {
        return localStorage.getItem(TOKEN);
    }

    static getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN);
    }

    static setToken(token: string, refreshToken: string): void {
        localStorage.setItem(TOKEN, token);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
        console.log(localStorage);
    }

    static hasToken(): boolean {
        return localStorage.getItem(TOKEN) !== null && localStorage.getItem(REFRESH_TOKEN) !== null;
    }

    static expireToken(): void {
        localStorage.removeItem(TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
    }


}