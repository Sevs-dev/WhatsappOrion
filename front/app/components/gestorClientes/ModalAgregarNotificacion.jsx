'use client';
import { Box, Button, IconButton, Modal, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClientApiService from '../../services/GestorCliente/ClientApiService';
import Toast from '../toastr/toast';

const ModalAgregarNotificacion = ({ id, onSaveSuccess }) => {
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        type: '',
        message: '',
    });
    const [formErrors, setFormErrors] = useState({
        titulo: false,
        descripcion: false,
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormErrors({ titulo: false, descripcion: false });
        setFormData({
            titulo: '',
            descripcion: '',
            id: id || '',
            id_url: '123',
            check_url: true,
            estado_flujo_activacion: false,
            estado: '',
            codigo: '',
            nombre: '',
            usuario: '',
        });
    };

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        id: id || '',
        id_url: '123',
        check_url: true,
        estado_flujo_activacion: false,
        estado: '',
        codigo: '',
        nombre: '',
        usuario: '',
    });

    useEffect(() => {
        if (id && open) {
            ClientApiService.getClientById(id)
                .then((response) => {
                    const clientData = response.data;
                    setFormData((prevState) => ({
                        ...prevState,
                        nombre: clientData.nombre,
                        codigo: clientData.codigo,
                        estado: clientData.estado,
                        usuario: clientData.usuario,
                        id: id,
                    }));
                })
                .catch((error) => {
                    console.error('Error obteniendo detalles del cliente:', error);
                    setToast({
                        show: true,
                        type: 'failure',
                        message: 'Error al obtener los detalles del cliente.',
                    });
                    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
                });
        }
    }, [id, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        if (formErrors[name]) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [name]: false,
            }));
        }
    };

    const handleSave = async () => {
        const errors = {
            titulo: !formData.titulo,
            descripcion: !formData.descripcion,
        };
        setFormErrors(errors);

        if (errors.titulo || errors.descripcion) {
            return;
        }

        const payload = {
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            usuario: formData.usuario,
            nombre: formData.nombre,
            codigo: formData.codigo,
            estado_flujo_activacion: formData.estado ?? false,
            check_url: formData.check_url ?? false,
            id_url: formData.id_url ? String(formData.id_url) : '',
            id_cliente_whatsapp: formData.id,
            fecha: new Date().toISOString(),
        };

        try {
            await ClientApiService.createMessage(payload);
            setToast({
                show: true,
                type: 'success',
                message: `La notificación "${formData.titulo}" se ha creado con éxito.`,
            });

            setFormData({
                titulo: '',
                descripcion: '',
                estado_flujo_activacion: '',
                usuario: '',
                codigo: '',
                nombre: '',
                id_url: '',
                check_url: false,
                id_cliente_whatsapp: '',
            });

            handleClose();

            // Llamar a la función de actualización después de guardar
            if (onSaveSuccess) {
                onSaveSuccess();
            }
        } catch (error) {
            console.error('Error creando notificación:', error);
            setToast({
                show: true,
                type: 'failure',
                message: 'Hubo un problema al crear la notificación. Intenta nuevamente.',
            });
        } finally {
            setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
        }
    };

    return (
        <>
            {toast.show && <Toast type={toast.type} message={toast.message} />}
            
            <Tooltip title="Agregar Notificación">
                <IconButton color="primary" onClick={handleOpen} className="btn btn-primary">
                    <AddCircleIcon />
                </IconButton>
            </Tooltip>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="modal-container"
                    sx={{
                        maxWidth: '600px', 
                        maxHeight: '90vh',
                        padding: 3,
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': { 
                            width: '8px'
                        },
                        '&::-webkit-scrollbar-track': { 
                            background: 'rgba(0, 0, 0, 0.1)', 
                            borderRadius: '12px'
                        },
                        '&::-webkit-scrollbar-thumb': { 
                            background: 'rgba(15, 63, 120, 0.9)', 
                            borderRadius: '12px', 
                            border: '2px solid rgba(0, 0, 0, 0.2)'
                        },
                        '&::-webkit-scrollbar-thumb:hover': { 
                            background: 'rgba(10, 50, 100, 1)'
                        },
                    }}
                >
                    <h1>Agregar Notificación</h1>
                    <div className="options">
                        <label>Título</label>
                        <div className="input-group">
                            <input
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                placeholder="Escribe el título"
                            />
                            {formErrors.titulo && (
                                <span className="error-message" style={{ color: 'red' }}>
                                    * Este campo es obligatorio
                                </span>
                            )}
                        </div>

                        <label>Descripción</label>
                        <div className="input-group">
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Escribe la descripción"
                                rows={4}
                                className="resize-y p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formErrors.descripcion && (
                                <span className="error-message text-red-500 text-sm">
                                    * Este campo es obligatorio
                                </span>
                            )}
                        </div>

                        <label className="form-label-2">Nombre del Cliente</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                disabled
                            />
                        </div>

                        <label className="form-label-2">Código Cliente</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                name="codigo"
                                value={formData.codigo}
                                onChange={handleChange}
                                disabled
                            />
                        </div>

                        <label>URL</label>
                        <div className="input-group">
                            <select
                                name="url"
                                value={formData.url}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar</option>
                                <option value="A">URL 1</option>
                                <option value="B">URL 2</option>
                            </select>
                        </div>

                        <label>Estado</label>
                        <div className="input-group">
                            <select
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>

                        <div className="buttons">
                            <Button variant="contained" color="error" onClick={handleClose}>
                                Cerrar
                            </Button>
                            <Button variant="contained" color="success" onClick={handleSave}>
                                Guardar
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
};

export default ModalAgregarNotificacion;