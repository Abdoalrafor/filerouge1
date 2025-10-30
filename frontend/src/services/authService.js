import API from './api';

export const register = async (userData) => {
    try {
        const response = await API.post('/register', userData);
        if (response.data.authorisation.token) {
            localStorage.setItem('token', response.data.authorisation.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const login = async (userData) => {
    try {
        const response = await API.post('/login', userData);
        if (response.data.authorisation.token) {
            localStorage.setItem('token', response.data.authorisation.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getUserDetails = async () => {
    try {
        const response = await API.get('/userdetail');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};