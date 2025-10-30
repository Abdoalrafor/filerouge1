import API from './api';

export const getLessons = async () => {
    try {
        const response = await API.get('/lessons');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getLesson = async (id) => {
    try {
        const response = await API.get(`/lessons/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const createLesson = async (lessonData) => {
    try {
        const response = await API.post('/lessons', lessonData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateLesson = async (id, lessonData) => {
    try {
        const response = await API.put(`/lessons/${id}`, lessonData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteLesson = async (id) => {
    try {
        const response = await API.delete(`/lessons/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const searchLessons = async (searchData) => {
    try {
        const response = await API.get('/lessons/search/by', { params: searchData });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};