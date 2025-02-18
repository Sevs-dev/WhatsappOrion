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
      return response.data;
    } catch (error) {
      console.error(`Error al obtener los mensajes para el cliente ${id}:`, error.message);
      throw error;
    }
  },

  saveWhatsappApi: async (data) => {
    try {
      const response = await apiClient.post('/whatsapp/whatsapp-api', data);
      console.log("Respuesta de la API al guardar el estado del whatsapp Api:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al guardar el estado del whatsapp Api:", error);
    }
  },

  getWhatsappApi: async () => {
    try {
      const response = await apiClient.get('/whatsapp/whatsapp-api');
      return response.data || [];
    } catch (error) {
      console.error("Error al obtener las URLs de la API:", error);
      throw error;
    }
  },

  getWhatsappApiId: async (id) => {
    try {
      const response = await apiClient.get(`/whatsapp/whatsapp-api/${id}`);
      return response.data || [];
    } catch (error) {
      console.error("Error al obtener las URLs de la API:", error);
      throw error;
    }
  },

  sendPrueba: async (id) => {
    try {
      const response = await apiClient.post(`/whatsapp/send-prueba/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error sending prueba:', error);
      throw error;
    }
  }
};

export default GestorEditorMensajes;
