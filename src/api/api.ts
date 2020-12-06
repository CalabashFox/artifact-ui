import axios, {AxiosPromise} from 'axios';
import TokenUtils from 'utils/commons';

const BASE_URL = 'http://localhost:8080/api';

export interface ApiResponse<T> {
    status: number
    entity: T
    message: string | null
}

export function post<T>(api: string, data?: any): AxiosPromise<ApiResponse<T>> {
    return axios({
        url: `${BASE_URL}${api}`,
        method: 'POST',
        data: data || {},
        headers: getHeaders()
    });
}

function getHeaders(): any {
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