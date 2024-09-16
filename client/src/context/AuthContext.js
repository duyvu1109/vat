import { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null,
    );
    const [user, setUser] = useState(() =>
        localStorage.getItem('current_user') ? JSON.parse(localStorage.getItem('current_user')) : null,
    );
    const [loading, setLoading] = useState(true);

    const loginUser = async (data) => {
        setAuthTokens(data);
        let current_user = {
            _id: data.user._id,
            is_staff: data.user.is_staff,
            username: data.user.username,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
        };
        setUser(current_user);
        localStorage.setItem('authTokens', JSON.stringify(data));
        localStorage.setItem('current_user', JSON.stringify(current_user));
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        localStorage.removeItem('current_user');
    };

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        loginUser,
        logoutUser,
    };

    useEffect(() => {
        if (authTokens) {
            setUser(localStorage.getItem('current_user') ? JSON.parse(localStorage.getItem('current_user')) : null);
        }
        setLoading(false);
    }, [authTokens, loading, localStorage]);

    return <AuthContext.Provider value={contextData}>{loading ? null : children}</AuthContext.Provider>;
};
