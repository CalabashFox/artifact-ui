import axios, {AxiosPromise} from 'axios';
import TokenUtils from 'utils/tokenUtils';

const BASE_URL = 'http://localhost:8080/api';
//const BASE_URL = 'https://10.254.0.88:8080/api';

export interface ApiResponse<T> {
    status: number
    content: T
    message: string | null
}

export function upload<T>(api: string, file: File): AxiosPromise<ApiResponse<T>> {
    const data = new FormData();
    data.append('file', file, file.name);
    return axios({
        baseURL: BASE_URL,
        url: api,
        method: 'POST',
        data: data,
        headers: getHeaders()
    });
}

export function post<T>(api: string, data: Record<string,unknown>): AxiosPromise<ApiResponse<T>> {
    return axios({
        baseURL: BASE_URL,
        url: api,
        method: 'POST',
        data: data || {},
        headers: getHeaders()
    });
}

export function get<T>(api: string, data: Record<string,unknown>): AxiosPromise<ApiResponse<T>> {
    return axios({
        baseURL: BASE_URL,
        url: api,
        method: 'GET',
        data: data || {},
        headers: getHeaders()
    });
}

function getHeaders(): Record<string, string> {
    const headers = {
        'Content-Type': 'application/json'
    }
    if (TokenUtils.hasToken()) {
        return Object.assign(headers, {
            'Authorization': 'Bearer ' + TokenUtils.getToken()
        });
    }
    return headers;
}