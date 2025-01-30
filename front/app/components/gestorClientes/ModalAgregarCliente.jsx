"use client"; // Agrega esta línea en la parte superior del archivo

import { Box, Button, Modal, Typography } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import ClientApiService from '../../services/GestorCliente/ClientApiService';
import Toast from '../toastr/toast';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    borderRadius: 12,
    p: 4,
};

const ModalCrearCliente = () => {
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        type: '',
        message: '',
    });

    const [formData, setFormData] = useState({
        id_cliente_whatsapp: '',
        nombre: '',
        estado: 1,
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            await ClientApiService.createClient(formData);
            handleClose();
            setFormData({ id_cliente_whatsapp: '', nombre: '', estado: 1 }); 
            setToast({
                show: true,
                type: 'success',
                message: `El cliente "${formData.nombre}" se ha creado con éxito.`,
            });
        } catch (error) {
            console.error('Error creando cliente:', error);
            handleClose();
            setToast({
                show: true,
                type: 'failure',
                message: 'Hubo un problema al crear el cliente. Intenta nuevamente.',
            });
        } finally {
            setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
        }
    };

    return (
        <div>
            {toast.show && (
                <Toast 
                    type={toast.type} 
                    message={toast.message} 
                />
            )}
            <button onClick={handleOpen} className='btn btn-primary'>Crear cliente</button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className='modal-container'>
                        <div>
                            <h1>Agregar de cliente</h1>
                        </div>

                        <div className='options'>
                            <label >Codigo Cliente</label>
                            <div className='input-group'>
                                <input type="text" 
                                    aria-describedby='basic-addon3 basic-addon4'
                                    placeholder='Escriba el codigo'
                                    name='id_cliente_whatsapp'
                                    value={formData.id_cliente_whatsapp}
                                    onChange={handleChange}
                                />
                            </div>

                            <label >Cliente</label>
                            <div className='input-group'>
                                <select 
                                    aria-label="Default select example"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}                
                                >
                                    <option>Seleccione una opcion</option>
                                    <option value="Cliente 1">Cliente 1</option>
                                    <option value="Cliente 2">Cliente 2</option>
                                </select>
                            </div>

                            <label >Estado</label>
                            <div className="input-group">
                                <select
                                    name="estado"
                                    value={formData.estado} 
                                    onChange={handleChange} 
                                >
                                    <option value={1}>Activo</option>
                                    <option value={0}>Inactivo</option>
                                </select>
                            </div>
                            
                            <div className='buttons'>
                                <Button variant="contained" color='error' onClick={handleClose}>Cerrar</Button>
                                <Button variant="contained" color='success' onClick={handleSave}>Guardar</Button>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalCrearCliente;