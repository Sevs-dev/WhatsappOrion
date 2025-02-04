import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


const GestorEditorMensajes = {
    getMessagesByClientId: async (id) => {
        try { 
            const response = await apiClient.get(`/message/search/${id}`);
            console.log("Mensajes obtenidos:", response.data); 
            return response.data;
        } catch (error) {
            console.error(`Error al obtener los mensajes para el cliente ${id}:`, error.message); 
            throw error;
        }
    },
};

export default GestorEditorMensajes;