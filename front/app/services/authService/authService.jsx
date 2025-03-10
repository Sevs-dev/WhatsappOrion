import axios from 'axios';
import {API_URL} from '../../config/api' 

// Crear una instancia de axios con configuraciones globales
const apiClient = axios.create({
    baseURL: API_URL, 
    headers: {
        'Content-Type': 'application/json',
    }
});

// 🔴 Eliminar un usuario
export const deleteUser = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.delete(`/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error eliminando el usuario con ID ${id}`, error);
        throw error;
    }
};

// 🔵 Registrar un usuario - pendiente agregar a register 
export const register = async (userData) => {
    try {
        const response = await apiClient.post('/register', userData);
        return response.data;
    } catch (error) {
        console.error("Error en el registro", error);
        throw error;
    }
};

// 🟠 Refrescar token
export const refreshToken = async () => {
    try {
        const response = await apiClient.post('/refresh');
        localStorage.setItem('token', response.data.token); // Almacena el nuevo token
        return response.data;
    } catch (error) {
        console.error("Error al refrescar el token:", error);
        throw error;
    }
};

// 🟣 Cerrar sesión
export const logout = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.post('/logout', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        localStorage.removeItem('token');
        return response.data;
    } catch (error) {
        console.error("Error cerrando sesión", error);
        throw error;
    }
};

// Función para obtener todos los usuarios
export const getUsers = async () => {
    try {
        const response = await apiClient.get('/users');
        return response.data;  // Retorna solo los datos
    } catch (error) {
        console.error("Error obteniendo los usuarios", error);
        throw error;
    }
};

// Función para obtener un usuario por ID
export const getUserById = async (id) => {
    try {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error obteniendo el usuario con ID ${id}`, error);
        throw error;
    }
};


export const updateUser = async (id, userData) => {
    try {
        const token = localStorage.getItem("token"); // Obtén el token
        if (!token) throw new Error("❌ No se encontró el token de autenticación");

        // Verifica la URL final antes de enviar la petición
        const url = `/users/update/${id}`;
        console.log(`📡 Enviando solicitud PUT a: ${apiClient.defaults.baseURL}${url}`);

        const response = await apiClient.put(url, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("✅ Respuesta del servidor:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error en updateUser:", error);

        if (error.response) {
            console.error("⚠️ Respuesta del servidor:", error.response.status, error.response.data);
            if (error.response.status === 401) {
                console.error("🔒 Token inválido o expirado");
            } else if (error.response.status === 404) {
                console.error("🚨 Ruta no encontrada. Verifica la URL en Laravel.");
            }
            throw error.response.data;
        } else if (error.request) {
            console.error("📡 No se recibió respuesta del servidor");
            throw new Error("No se recibió respuesta del servidor");
        } else {
            console.error("⚙️ Error al configurar la solicitud:", error.message);
            throw new Error("Error al configurar la solicitud");
        }
    }
};

// Función para agregar un nuevo usuario
export const addUser = async (userData) => {
    try {
        const response = await apiClient.post('/useradd', userData);
        return response.data;
    } catch (error) {
        console.error("Error al agregar usuario", error);
        throw error;
    }
};


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


