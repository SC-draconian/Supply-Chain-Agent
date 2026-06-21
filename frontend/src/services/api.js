import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

let authToken = '';

export const login = async (username, password) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    
    const response = await api.post('/login/access-token', params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    
    authToken = response.data.access_token;
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    return response.data;
};

export const triggerAnalysis = async (location, keyword, portId) => {
    const response = await api.post(`/trigger-analysis?location=${location}&keyword=${keyword}&port_id=${portId}`);
    return response.data;
};
