import axios from 'axios';
import { API_URL } from '../../config/api'

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const GestorFlujosServ = {

    // Obtener lista de todos los clientes
    getAllClients: async () => {
        // console.log("Solicitando lista de clientes...");
        try {
            const response = await apiClient.get('/client/info');
            // console.log("Lista de clientes obtenida:", response.data); // Log para ver los datos obtenidos
            return response.data; // Retorna la respuesta del servidor
        } catch (error) {
            console.error('Error fetching clients:', error); // Log de error
            throw error;
        }
    },

    // Obtener códigos de todos los clientes
    getAllClientsApi: async () => {
        // console.log("Solicitando códigos de clientes...");
        try {
            const response = await apiClient.get('/clients');
            // console.log("Códigos de clientes obtenidos:", response.data); // Log para ver los códigos obtenidos
            return response.data; // Retorna la respuesta del servidor
        } catch (error) {
            console.error('Error fetching clients:', error); // Log de error
            throw error;
        }
    },

    // Obtener un mensaje específico por ID
    getMessageById: async (id) => {
        // console.log(`Solicitando mensaje con ID: ${id}...`);
        try {
            const response = await apiClient.get(`/message/${id}`); // Usando el id en la ruta
            // console.log("Mensaje obtenido:", response.data); // Log para ver los datos del mensaje
            return response.data; // Retorna el mensaje obtenido
        } catch (error) {
            console.error('Error fetching message by ID:', error); // Log de error
            throw error;
        }
    },

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

    // Método para crear un status_parameterization
    saveEstadoFlujo: async (data) => {
        try {
            const response = await apiClient.post('/status/create', data);
            return response.data;
        } catch (error) {
            console.error('Error guardando el estado del flujo:', error); // Log de error
            throw error;
        }
    },

    getClientStates: async (clientId) => {
        try {
            const response = await apiClient.get(`/status/${clientId}/estados`);

            // Si no hay datos, retornamos un objeto vacío
            if (!response.data || !response.data.data) {
                return { estados: [] };
            }

            const data = response.data.data;
            let estados = data.estados || []; // Si estados es null o undefined, usa un array vacío

            // Verificar si estados es un string y tratar de parsearlo
            if (typeof estados === "string") {
                try {
                    estados = JSON.parse(estados);
                } catch (parseError) {
                    console.error("Error al parsear los estados:", parseError);
                    estados = []; // En caso de error, retornar un array vacío
                }
            }

            return { ...data, estados };
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn(`No se encontraron estados para el cliente ${clientId}`);
                return { estados: [] }; // Retornar un array vacío en caso de 404
            }

            console.error("Error al obtener los estados del cliente:", error);
            return { estados: [] }; // Evitar que el error rompa la app
        }
    },

    getMessagesByClientId: async (id) => {
        try {
            // console.log(`Solicitando mensajes para el cliente con ID: ${id}...`);
            // Realizamos la petición GET a la ruta /search/{id}
            const response = await apiClient.get(`/message/search/${id}`);
            // console.log("Mensajes obtenidos:", response.data);
            // Se retorna la data (puedes personalizar la respuesta según lo que necesites)
            return response.data;
        } catch (error) {
            console.error(`Error al obtener los mensajes para el cliente ${id}:`, error.message);
            // Puedes personalizar la forma en que se maneja el error
            throw error;
        }
    },

    saveDropStatus: async (data) => {
        try {
            const response = await apiClient.post(`/drop/create`, data);
            return response.data;
        } catch (error) {
            console.error("Error al guardar el estado del drop:", error);
        }
    },

    getDropStatus: async (clientId) => {
        try {
            const response = await apiClient.get(`/drop/data/${clientId}`);

            if (response.status !== 200) {
                throw new Error('No se pudieron obtener los mensajes.');
            }
            return response.data.datos;
        } catch (error) {
            console.error('Error al obtener los mensajes:', error);
            throw error;
        }
    },

}

export default GestorFlujosServ;
