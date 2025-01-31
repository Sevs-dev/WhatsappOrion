import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const ClientApiService = {

    getClients: async () => {
        try {
            const response = await apiClient.get('/clients');
            const clients = response.data;
            // console.log(clients);
            // clients.forEach(client => {
            //     console.log(client.codigo_cliente);
            //     console.log(client.descripcion_cliente);
            // });
            return clients;
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    },

    // Obtener lista de clientes
    getAllClients: async () => {
        try {
            const response = await apiClient.get('/client/list'); //Cambie para obtener lista de clientes
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

    //Crear mensaje
    createMessage: async (data) => {
        console.log(data);
        try { 
            const response = await apiClient.post('/message/create', data);
            console.log(response);
            return response.data;
        } catch (error) {
            console.error('Error creando la notificacion: ', error);
            throw error;
        }
    },

    getNotificationsByClient: async (id_cliente) => {
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
            const response = await apiClient.put(`http://127.0.0.1:8000/api/message/update/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating message:', error);
            throw error;
        }
    },

    //Obtener un cliente por ID
    getClientById: async (id) => {
        try {
            const response = await apiClient.get(`/client/search/${id}`);
            
            // Mostrar todo el contenido para depurar
            // console.log('Respuesta completa:', response);
            
            // Asegúrate de retornar los datos correctos
            return response.data;  // Deberías retornar response.data directamente si el cliente está ahí
        } catch (error) {
            if (error.response) {
                console.error('Error fetching client by ID:', error.response.data.message);
            } else {
                console.error('Error fetching client by ID:', error.message);
            }
            throw error;
        }
    },
    
    

};

export default ClientApiService;
