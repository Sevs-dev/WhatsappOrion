import axios from 'axios';

const BASE_URL = 'https://whatsapp-orion.osinagazm.com/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const ClientApiService = {

    // Obtener la lista de clientes desde la API
    getClients: async () => {
        try {
            const response = await apiClient.get('/clients');
            const clients = response.data;
            // console.log("Lista de clientes obtenida:", clients);
            return clients;
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    },

    // Obtener lista de clientes para la lista de Gestor mensaje
    getAllClients: async () => {
        // console.log("Solicitando lista de clientes...");
        try {
            const response = await apiClient.get('/client/info'); // Cambié para obtener lista de clientes
            // console.log("Lista de clientes obtenida:", response.data); // Ver datos obtenidos
            return response.data; // Retorna la respuesta del servidor
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    },

    // Crear un nuevo cliente
    createClient: async (data) => {
        // console.log("Creando nuevo cliente con los datos:", data);
        try {
            const response = await apiClient.post('/client/create', data);
            // console.log("Cliente creado:", response.data); // Log para ver la respuesta
            return response.data;
        } catch (error) {
            console.error('Error creating client:', error);
            throw error;
        }
    },

    // Crear mensaje
    createMessage: async (data) => {
        // console.log("Creando mensaje con los datos:", data);
        try {
            const response = await apiClient.post('/message/create', data);
            // console.log("Mensaje creado:", response.data); // Log para ver la respuesta
            return response.data;
        } catch (error) {
            console.error('Error creando la notificación:', error);
            throw error;
        }
    },

    // Obtener notificaciones de un cliente
    getNotificationsByClient: async (id_cliente) => {
        // console.log(`Solicitando notificaciones para el cliente con ID: ${id_cliente}`);
        try {
            const response = await apiClient.get(`/message/list/${id_cliente}`);
            // console.log("Notificaciones obtenidas:", response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching messages by client:', error);
            throw error;
        }
    },

    // Actualizar mensaje
    updateMessage: async (id, data) => {
        // console.log(`Actualizando mensaje con ID: ${id} con los datos:`, data);
        try {
            const response = await apiClient.put(`/message/update/${id}`, data);
            // console.log("Mensaje actualizado:", response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating message:', error);
            throw error;
        }
    },

    // Obtener un cliente por ID
    getClientById: async (id) => {
        // console.log(`Solicitando cliente con ID: ${id}...`);
        try {
            const response = await apiClient.get(`/client/search/${id}`);
            // console.log("Cliente obtenido:", response.data); // Log para ver los datos del cliente
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error('Error fetching client by ID:', error.response.data.message);
            } else {
                console.error('Error fetching client by ID:', error.message);
            }
            throw error;
        }
    },

    // Obtener un cliente por código
    getClientByCodigo: async (codigo) => {
        // console.log(`Solicitando cliente con código: ${codigo}...`);
        try {
            const response = await apiClient.get(`/dato/${codigo}`); // Usando el código en la ruta
            // console.log("Cliente encontrado:", response.data); // Log para ver los datos del cliente
            return response.data; // Retorna los datos del cliente
        } catch (error) {
            console.error('Error fetching client by code:', error); // Log de error
            throw error;
        }
    },

    // Crear un nuevo cliente
    createParams: async (parametros) => {
        try {
            const response = await apiClient.post('/parametros/params', parametros);
            return response.data;
        } catch (error) {
            console.error('Error creando parámetro:', error.response || error.message);
            throw error;
        }
    },

    getParams: async () => {
        try {
            const response = await apiClient.get('/parametros/parametros'); 
            return response.data;
        } catch (error) {
            console.error('Error fetching params:', error);
            throw error;
        }
    }

};

export default ClientApiService;
