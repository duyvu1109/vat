import { notifyError } from '~/utils/notifications';

export const BASE_API_URL = process.env.REACT_APP_BASE_URL;

const getBaseConfig = (method) => ({
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
});

const handle401 = (resp) => {
    if (resp.status === 401) {
        notifyError('Unauthenticated.');
    } else if (resp.status === 423) {
        notifyError('Your account has been locked.');
    }
    return resp;
};

const serializeResponse = (response) => {
    return response
        .text()
        .then((text) => {
            return text ? JSON.parse(text) : {};
        })
        .then((data) => ({ status: response.status, ok: response.ok, data }));
};

export const get = (url, options) =>
    fetch(`${BASE_API_URL}/${url}`, { ...getBaseConfig('get'), ...options })
        .then(serializeResponse)
        .then(handle401);

export const post = (url, data, options) =>
    fetch(`${BASE_API_URL}/${url}`, {
        ...getBaseConfig('post'),
        ...options,
        body: JSON.stringify(data),
    })
        .then(serializeResponse)
        .then(handle401);
