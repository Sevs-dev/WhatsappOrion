import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const ClientApiService = {
    // Obtener lista de clientes
    getAllClients: async () => {
        try {
            const response = await apiClient.get('/client/list');
            return response.data; // Retorna la respuesta del servidor
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    },

    // Crear un nuevo cliente
    createClient: async (data) => {
        try {
            const response = await apiClient.post('/client/create', data);
            return response.data;
        } catch (error) {
            console.error('Error creating client:', error);
            throw error;
        }
    },

    createMessage: async (data) => {
        try {
            const response = await apiClient.post('/message/create', data);
            console.log(response);
            return response.data;
        }catch (error) {
            console.error('Error creando la notificacion: ', error);
            throw error;
        }
    },

    getNotificationsByClient: async(id_cliente) => {
        try {
            const response = await apiClient.get(`/message/list/${id_cliente}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching messages by client:', error);
            throw error;
        }
    },

    updateMessage: async (id, data) => {
        try {
            const response = await apiClient.put(`http://127.0.0.1:8000/api/message/update/${id}`,data);
            return response.data;
        } catch (error) {
            console.error('Error updating message:', error);
            throw error;
        }
    }

};

export default ClientApiService;
