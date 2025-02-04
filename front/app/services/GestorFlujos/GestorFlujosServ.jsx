import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
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
            // Verificar la estructura completa de la respuesta
            // console.log("Respuesta completa del servidor:", response.data);
            // Accedemos a la data interna donde se encuentra la propiedad estados
            const data = response.data.data;
            let estados = data.estados;

            // Verificamos si estados es un string y lo parseamos
            if (typeof estados === 'string') {
                try {
                    estados = JSON.parse(estados);
                } catch (parseError) {
                    console.error("Error al parsear los estados:", parseError);
                    throw new Error("Formato de estados inválido.");
                }
            }

            // Retornamos un objeto que combine la data original y el arreglo de estados parseado
            return { ...data, estados };

        } catch (error) {
            console.error("Error al obtener los estados del cliente:", error);
            throw error;
        }
    },

    getMessagesByClientId: async (id) => {
        try {
            // console.log(`Solicitando mensajes para el cliente con ID: ${id}...`);
            // Realizamos la petición GET a la ruta /search/{id}
            const response = await apiClient.get(`/message/search/${id}`);
            console.log("Mensajes obtenidos:", response.data);
            // Se retorna la data (puedes personalizar la respuesta según lo que necesites)
            return response.data;
        } catch (error) {
            console.error(`Error al obtener los mensajes para el cliente ${id}:`, error.message);
            // Puedes personalizar la forma en que se maneja el error
            throw error;
        }
    },
}

export default GestorFlujosServ;
