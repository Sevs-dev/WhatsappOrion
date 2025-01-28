import { Box, Button, IconButton, Modal, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Swal from 'sweetalert2';
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

const ModalAgregarNotificacion = ({ id_cliente_whatsapp }) => {
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        type: '',
        message: '',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        id_cliente_whatsapp: id_cliente_whatsapp || '',
        id_url: '123',
        check_url: true,
        estado_flujo_activacion: false,
        estado: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!formData.titulo || !formData.descripcion || !formData.id_cliente_whatsapp) {
            setToast({
                show: true,
                type: 'warning',
                message: 'Por favor completa todos los campos antes de guardar.',
            });
            setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
            return;
        }

        const payload = {
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            check_url: formData.check_url,
            id_url: parseInt(formData.id_url, 10),
            estado_flujo_activacion: formData.estado_flujo_activacion,
            id_cliente_whatsapp: formData.id_cliente_whatsapp,
            estado: parseInt(formData.estado, 10),
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
                id_cliente_whatsapp: '',
                url: '',
                estado: '',
            });
            handleClose();
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
            {toast.show && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                />
            )}
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
                <Box sx={style}>
                    <div className="modal-container">
                        <h1>Agregar Notificación</h1>

                        <div className="options">
                            <label className="form-label-2">Título</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    placeholder="Escribe el título"
                                />
                            </div>

                            <label className="form-label-2">Descripción</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Escribe la descripción"
                                />
                            </div>

                            <label className="form-label-2">Código Cliente</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="id_cliente_whatsapp"
                                    value={formData.id_cliente_whatsapp}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>

                            <label className="form-label-2">URL</label>
                            <div className="input-group">
                                <select
                                    className="form-select"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="A">URL 1</option>
                                    <option value="B">URL 2</option>
                                </select>
                            </div>

                            <label className="form-label-2">Estado</label>
                            <div className="input-group">
                                <select
                                    className="form-select"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="1">Activo</option>
                                    <option value="2">Inactivo</option>
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
                    </div>
                </Box>
            </Modal>
        </>
    );
};

export default ModalAgregarNotificacion;