import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});


const ConfigApiService = {

    getAllConfigs: async () => {
        try {
            const response = await apiClient.get('/config/list'); 
            return response.data.configurations;
        } catch (error) {
            console.error('Error fetching config by ID:', error);
            return [];
        }
    },

    createConfig: async (data) => {
        try {
            const response = await apiClient.post('/config/create', data);
            return response.data; 
        } catch (error) {
            console.log('Error creando la configuracion:', error);
            throw error;
        }
    } 


}

export default ConfigApiService;