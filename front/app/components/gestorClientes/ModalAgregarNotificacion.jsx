import { Box, Button, IconButton, Modal, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClientApiService from '../../services/GestorCliente/ClientApiService';
import ApiUrl from '../../services/EditarMensajes/GestorEditorMensajes';
import Toast from '../toastr/toast';
import TextField from '@mui/material/TextField';


const ModalAgregarNotificacion = ({ id, onSaveSuccess }) => {
    const [open, setOpen] = useState(false);
    const [urlApi, setUrlApi] = useState([]);
    const [paramModalOpen, setParamModalOpen] = useState(false);
    const [newParamName, setNewParamName] = useState('');
    const [newParamLabel, setNewParamLabel] = useState('');
    const [availableVariables, setAvailableVariables] = useState([]);
    const [paramSaved, setParamSaved] = useState(false);
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
            api_url: '',
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
        api_url: true,
        estado_flujo_activacion: false,
        estado: '',
        codigo: '',
        nombre: '',
        usuario: '',
    });

    useEffect(() => {
        const fetchParams = async () => {
            try {
                const params = await ClientApiService.getParams();
                const variables = params.data ? params.data : params;  // Ajustar dependiendo de la estructura
                setAvailableVariables(Array.isArray(variables) ? variables : []);
            } catch (error) {
                console.error('Error al obtener los parámetros:', error);
            }
        };

        fetchParams();
    }, [paramSaved]);


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

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await ApiUrl.getWhatsappApi(); // Obtener solo las URLs de la API de WhatsApp
                const apiUrls = data.map(client => client.api_url); // Extraer solo las URLs
                setUrlApi(apiUrls); // Establecer las URLs en el estado
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();
    }, []);

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
            api_url: formData.api_url ?? false,
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
                api_url: '',
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

    const handleInsertVariable = (variable) => {
        setFormData((prevState) => ({
            ...prevState,
            descripcion: `${prevState.descripcion} {{${variable}}}`,
        }));
    };

    // Manejo de apertura/cierre del modal de parámetros
    const handleOpenParamModal = () => setParamModalOpen(true);
    const handleCloseParamModal = () => {
        setParamModalOpen(false);
        setNewParamName('');
        setNewParamLabel('');
    };

    const handleSaveParam = async () => {
        if (!newParamName || !newParamLabel) {
            setToast({
                show: true,
                type: 'failure',
                message: 'El nombre y el label del parámetro son obligatorios.',
            });
            return;
        }

        const parametros = { name: newParamName, label: newParamLabel };
        try {
            await ClientApiService.createParams(parametros);
            setToast({
                show: true,
                type: 'success',
                message: `Parámetro creado con éxito.`,
            });
            setParamSaved(prev => !prev);  // Cambiar el valor de `paramSaved`
            handleCloseParamModal();
        } catch (error) {
            console.error('Error creando parámetro:', error);
            setToast({
                show: true,
                type: 'failure',
                message: 'Hubo un error al crear el parámetro.',
            });
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
                        </div>

                        {/* Botón para abrir el modal de creación de parámetros */}
                        <Button variant="outlined" color="primary" onClick={handleOpenParamModal}>
                            Agregar Parámetro
                        </Button>

                        {/* Modal para crear un parámetro */}
                        <Modal open={paramModalOpen} onClose={handleCloseParamModal}>
                            <Box className="modal-container">
                                <h2>Crear Parámetro</h2>
                                <TextField
                                    label="Parámetro requerido"
                                    value={newParamName}
                                    onChange={(e) => setNewParamName(e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="Nombre del Parámetro"
                                    value={newParamLabel}
                                    onChange={(e) => setNewParamLabel(e.target.value)}
                                    fullWidth
                                />
                                <Button variant="contained" color="primary" onClick={handleSaveParam}>
                                    Guardar Parámetro
                                </Button>
                                <Button variant="outlined" color="error" onClick={handleCloseParamModal}>
                                    Cancelar
                                </Button>
                            </Box>
                        </Modal>

                        <div style={{ marginTop: '20px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Seleccionar Variables</h4>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                                {Array.isArray(availableVariables) && availableVariables.map((param, index) => (
                                    <Button
                                        key={param.name}  // Usar param.name aquí para el key
                                        onClick={() => handleInsertVariable(param.name)}  // Usar param.name aquí también
                                        variant="outlined"
                                        color="primary"
                                        sx={{
                                            padding: '6px 12px',   // Reducción de padding
                                            borderRadius: '6px',
                                            textTransform: 'capitalize',
                                            fontWeight: '400',
                                            fontSize: '0.7rem',  // Tamaño de fuente reducido
                                            boxShadow: 'none',
                                            border: '1px solid #1976d2', // Añadir un borde sutil
                                            '&:hover': {
                                                backgroundColor: '#1976d2',
                                                color: '#fff',
                                                borderColor: '#1565c0',
                                            },
                                        }}
                                    >
                                        {param.label} {/* Mostrar los datos del parámetro */}
                                    </Button>
                                ))}
                            </div>

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
                                name="api_url"
                                value={formData.api_url}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar</option>
                                {urlApi.map((url, index) => (
                                    <option key={index} value={url}>
                                        {url}
                                    </option>
                                ))}
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
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                            >
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
