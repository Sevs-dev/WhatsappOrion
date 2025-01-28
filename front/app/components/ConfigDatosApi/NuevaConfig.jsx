import { Button } from '@mui/material'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import ConfigApiService from '../../services/ConfigDatosApi/ConfigDatosServ';

const NuevaConfig = () => {

    const[formData, setFormData] = useState({
        token_api: '',
        numero_verificacion: '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleSendClick = async () => {
        try {
            const response = await ConfigApiService.createConfig(formData);
                Swal.fire({
                    title: 'Token Activo',
                    text: "El token ha sido activado con exito",
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                });
                setFormData({ token_api: '', numero_verificacion: ''});
        } catch (error) {
            console.error('Error creando la configuracion:', error);
            Swal.fire({
                title: 'Error',
                text: "El token no ha sido activado",
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    }

  return (
    <div>
        <div className='header'>
            <h1>Configuracion de datos de la API de Whatsaap</h1>
        </div>

        <div className='content'>
            <div className='form-2'>
                <div className='form-content-2'>
                    <div className="options">
                        <label className="form-label-2">Token API</label>
                        <div className='input-group'>
                            <textarea
                                className='form-control'
                                aria-label="With textarea"
                                placeholder='Token de API'
                                name="token_api"
                                value={formData.token_api} 
                                onChange={handleChange}
                            >
                            </textarea>
                        </div>
                    </div>

                    <div className="options">
                        <label className="form-label-2">Numero Verificacion de funcionamiento</label>
                        <div className='input-group'>
                            <input type="number" 
                                className='form-control'
                                aria-describedby='basic-addon3 basic-addon4'
                                placeholder='+57'
                                name="numero_verificacion"
                                value={formData.numero_verificacion} 
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className='buttons'>
                        <Button variant="contained" color='secondary'>Guardar</Button>
                        <Button 
                            variant="contained" 
                            color='success'
                            onClick={handleSendClick}
                        >
                            Enviar</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NuevaConfig