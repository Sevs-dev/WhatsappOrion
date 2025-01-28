import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});


const GestorFlujosServ = {

    saveDiagrama: async (data) => {
        console.log(data);
        try {
            const response = await apiClient.post('/config/create', data);
         
            return response.data;
        } catch (error) {
            console.log('Error creando la configuracion:', error);
            throw error;
        }
    }


}

export default GestorFlujosServ;