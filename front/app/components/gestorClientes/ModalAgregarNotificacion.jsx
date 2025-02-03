'use client';
import { Box, Button, IconButton, Modal, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react'; // Hooks de React para manejo de estado y efectos secundarios
import AddCircleIcon from '@mui/icons-material/AddCircle'; // Icono para agregar algo
import ClientApiService from '../../services/GestorCliente/ClientApiService'; // Servicio para interactuar con la API de clientes
import Toast from '../toastr/toast'; // Componente para mostrar notificaciones emergentes (toast)

// Estilos del modal
const style = {
    position: 'absolute',
    top: '50%', // Centrado verticalmente
    left: '50%', // Centrado horizontalmente
    transform: 'translate(-50%, -50%)', // Centrado perfecto en la pantalla
    width: 500, // Ancho del modal
    borderRadius: 12, // Bordes redondeados
    p: 4, // Padding
};

// Componente para agregar una nueva notificación
const ModalAgregarNotificacion = ({ id }) => {
    // Estado para controlar si el modal está abierto o cerrado
    const [open, setOpen] = useState(false);
    // Estado para gestionar las notificaciones (toast)
    const [toast, setToast] = useState({
        show: false,
        type: '', // Puede ser 'success' o 'failure'
        message: '', // El mensaje que muestra el toast
    });
    // Estado para los errores de los campos del formulario
    const [formErrors, setFormErrors] = useState({
        titulo: false,
        descripcion: false,
    });

    // Función para abrir el modal
    const handleOpen = () => setOpen(true);
    // Función para cerrar el modal y limpiar los errores del formulario
    const handleClose = () => {
        setOpen(false);
        setFormErrors({ titulo: false, descripcion: false });
    };

    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        id: id || '', // Si hay un ID, lo usa, si no, se queda en blanco
        id_url: '123', // ID de URL predefinido
        check_url: true, // Estado para la URL seleccionada
        estado_flujo_activacion: false, // Estado de flujo de activación
        estado: '', // Estado de la notificación (Activo/Inactivo)
        codigo: '', // Código del cliente
        nombre: '', // Nombre del cliente
        usuario: '', // Usuario del cliente
    });

    // Efecto que se ejecuta cuando el ID del cliente cambia
    useEffect(() => {
        if (id) {
            // Si hay un ID, hacemos una solicitud a la API para obtener los datos del cliente
            ClientApiService.getClientById(id)
                .then((response) => {
                    const clientData = response.data;
                    setFormData((prevState) => ({
                        ...prevState,
                        nombre: clientData.nombre, // Llenamos el campo nombre
                        codigo: clientData.codigo, // Llenamos el campo código
                        estado: clientData.estado, // Llenamos el campo estado
                        usuario: clientData.usuario, // Llenamos el campo usuario
                        id: id, // Actualizamos el ID del cliente
                    }));
                })
                .catch((error) => {
                    console.error('Error obteniendo detalles del cliente:', error);
                    // Si hay un error al obtener el cliente, mostramos un toast de error
                    setToast({
                        show: true,
                        type: 'failure',
                        message: 'Error al obtener los detalles del cliente.',
                    });
                    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
                });
        }
    }, [id]); // Este efecto se ejecuta cada vez que el ID cambia

    // Función para manejar los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value, // Actualiza el campo correspondiente en formData
        }));
        // Si hay un error en el campo que el usuario está escribiendo, lo limpiamos
        if (formErrors[name]) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [name]: false, // Limpiar error en el campo
            }));
        }
    };

    // Función para manejar el guardado de la notificación
    const handleSave = async () => {
        // Validación de los campos obligatorios (titulo y descripcion)
        const errors = {
            titulo: !formData.titulo,
            descripcion: !formData.descripcion,
        };
        setFormErrors(errors); // Actualiza los errores en el formulario

        // Si alguno de los campos es obligatorio y está vacío, detenemos la ejecución
        if (errors.titulo || errors.descripcion) {
            return; // Si hay errores, no seguimos
        }

        // Creamos el objeto con los datos a enviar al backend
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
            fecha: new Date().toISOString(), // Fecha actual en formato ISO
        };

        try {
            // Llamamos al servicio para crear la notificación
            await ClientApiService.createMessage(payload);
            // Si la notificación se crea con éxito, mostramos un toast de éxito
            setToast({
                show: true,
                type: 'success',
                message: `La notificación "${formData.titulo}" se ha creado con éxito.`,
            });

            // Reiniciamos el formulario después de guardar
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

            // Cerramos el modal
            handleClose();
        } catch (error) {
            console.error('Error creando notificación:', error);
            // Si hay un error al crear la notificación, mostramos un toast de error
            setToast({
                show: true,
                type: 'failure',
                message: 'Hubo un problema al crear la notificación. Intenta nuevamente.',
            });
        } finally {
            // Escondemos el toast después de 3 segundos
            setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
        }
    };

    return (
        <>
            {/* Si hay un toast (mensaje emergente), lo mostramos */}
            {toast.show && <Toast type={toast.type} message={toast.message} />}
            
            {/* Botón para abrir el modal */}
            <Tooltip title="Agregar Notificación">
                <IconButton color="primary" onClick={handleOpen} className="btn btn-primary">
                    <AddCircleIcon /> {/* Icono de agregar */}
                </IconButton>
            </Tooltip>

            {/* Modal con el formulario para agregar la notificación */}
            <Modal
                open={open} // Si el modal está abierto o cerrado
                onClose={handleClose} // Función para cerrar el modal
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}> {/* Aplica el estilo definido previamente */}
                    <div className="modal-container">
                        <h1>Agregar Notificación</h1>

                        <div className="options">
                            {/* Campo para el título de la notificación */}
                            <label>Título</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    placeholder="Escribe el título"
                                />
                                {/* Si hay un error en el campo título, mostramos un mensaje */}
                                {formErrors.titulo && (
                                    <span style={{ color: 'red', fontSize: '12px' }}>
                                        Este campo es obligatorio
                                    </span>
                                )}
                            </div>

                            {/* Campo para la descripción de la notificación */}
                            <label>Descripción</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Escribe la descripción"
                                />
                                {/* Si hay un error en el campo descripción, mostramos un mensaje */}
                                {formErrors.descripcion && (
                                    <span style={{ color: 'red', fontSize: '12px' }}>
                                        Este campo es obligatorio
                                    </span>
                                )}
                            </div>

                            {/* Mostrar el nombre y el código del cliente (solo lectura) */}
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

                            {/* Selección de URL */}
                            <label>URL</label>
                            <div className="input-group">
                                <select
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="url1">URL 1</option>
                                    <option value="url2">URL 2</option>
                                </select>
                            </div>

                            {/* Botón para guardar la notificación */}
                            <div className="modal-footer">
                                <Button onClick={handleSave} variant="contained" color="primary">
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
