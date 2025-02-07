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
      const response = await apiClient.get(`/message/search/${id}`); // Cambia esta ruta si es necesario
      console.log("Respuesta completa de la API:", response);  // Imprime toda la respuesta de la API
      return response.data;  // Devuelve los mensajes
    } catch (error) {
      console.error(`Error al obtener los mensajes para el cliente ${id}:`, error.message);
      throw error;
    }
  },
};

export default GestorEditorMensajes;
