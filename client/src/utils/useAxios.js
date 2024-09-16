import axios from 'axios';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL

const useAxios = () => {
    const navigate = useNavigate();
    const { logoutUser, authTokens, setUser, setAuthTokens } = useContext(AuthContext);

    const axiosInstance = axios.create({
        BASE_URL,
        headers: { Authorization: `Bearer ${authTokens?.access}` },
    });

    axiosInstance.interceptors.request.use(async (req) => {
        const user = jwt_decode(authTokens.access);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

        if (!isExpired) return req;

        if (!authTokens.refresh) {
            logoutUser();
            navigate(`/error401`);
            return;
        }

        var response;
        
        try {
            response = await axios.post(`${BASE_URL}/token/refresh/`, {
                refresh: authTokens.refresh,
            });
        } catch (err) {
            logoutUser();
            navigate(`/error401`);
            return;
        }

        localStorage.setItem('authTokens', JSON.stringify(response.data));

        setAuthTokens(response.data);
        setUser(localStorage.getItem('current_user') ? JSON.parse(localStorage.getItem('current_user')) : null);

        req.headers.Authorization = `Bearer ${response.data.access}`;
        return req;
    });

    return axiosInstance;
};

export default useAxios;
