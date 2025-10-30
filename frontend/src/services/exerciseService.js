import API from './api';

export const getExercises = async () => {
    try {
        const response = await API.get('/exercises');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getExercise = async (id) => {
    try {
        const response = await API.get(`/exercises/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const createExercise = async (exerciseData) => {
    try {
        const response = await API.post('/exercises', exerciseData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateExercise = async (id, exerciseData) => {
    try {
        const response = await API.put(`/exercises/${id}`, exerciseData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteExercise = async (id) => {
    try {
        const response = await API.delete(`/exercises/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const searchExercises = async (searchData) => {
    try {
        const response = await API.get('/exercises/search/by', { params: searchData });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const assignPoints = async (pointsData) => {
    try {
        const response = await API.post('/exercises/assign-points', pointsData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};