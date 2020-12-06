export function emptyValue(value: string | null): boolean {
    return typeof value === undefined || value === '' || value === null;
}

