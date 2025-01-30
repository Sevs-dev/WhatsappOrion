import { Box, Button, IconButton, Modal, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react';
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

const ModalAgregarNotificacion = ({ id }) => {
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        type: '',
        message: '',
    });

    const handleOpen = () => {
        // console.log("Abriendo modal");
        setOpen(true);
    };

    const handleClose = () => {
        // console.log("Cerrando modal");
        setOpen(false);
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

    // Obtener detalles del cliente cuando el id cambia
    useEffect(() => {
        // console.log('ID:', id); // Verificar si el id tiene un valor
        if (id) {
            ClientApiService.getClientById(id)
                .then((response) => {
                    const clientData = response.data; // Acceder al campo 'data' que contiene los detalles
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
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!formData.titulo || !formData.descripcion || !formData.id) {
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

            // Reiniciar el formulario correctamente
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
                <Box sx={style}>
                    <div className="modal-container">
                        <h1>Agregar Notificación</h1>

                        <div className="options">
                            <label >Título</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    placeholder="Escribe el título"
                                />
                            </div>

                            <label >Descripción</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Escribe la descripción"
                                />
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

                            <label >URL</label>
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

                            <label >Estado</label>
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
                    </div>
                </Box>
            </Modal>
        </>
    );
};

export default ModalAgregarNotificacion;
