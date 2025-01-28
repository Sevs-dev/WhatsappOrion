import axios from 'axios';

const API_URL = 'http://localhost:8000/api';  // Ajusta según el puerto de tu servidor

// Crear una instancia de axios con configuraciones globales
const apiClient = axios.create({
    baseURL: API_URL,  // Usamos la URL base
    headers: {
        'Content-Type': 'application/json',
    }
});

// Función para manejar el login
export const login = async (email, password) => {
    try {
        // Usamos axios para hacer la solicitud POST
        const response = await apiClient.post('/login', {
            email,
            password,
        });

        // Si la respuesta es exitosa, retornamos los datos
        return { success: true, data: response.data };
    } catch (error) {
        // En caso de error, manejamos la respuesta de error
        if (error.response) {
            // Si hay una respuesta de error desde el servidor
            return { success: false, message: error.response.data.message || error.response.statusText };
        } else {
            // Si el error es por problemas de red u otros
            return { success: false, message: error.message };
        }
    }
};
