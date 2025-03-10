import { Box, Button, IconButton, Modal, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClientApiService from '../../services/GestorCliente/ClientApiService';
import ApiUrl from '../../services/EditarMensajes/GestorEditorMensajes';
import Toast from '../toastr/toast';
import TextField from '@mui/material/TextField';
import Text from '../text/Text'
import Buttons from '../button/Button'

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
            <Buttons onClick={handleOpen} variant="create" label="Agregar Mensaje" />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-10"
                    sx={{
                        maxHeight: "90vh",
                        overflowY: "auto",
                        "&::-webkit-scrollbar": { width: "8px" },
                        "&::-webkit-scrollbar-track": {
                            background: "rgba(0, 0, 0, 0.1)",
                            borderRadius: "12px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "rgba(15, 63, 120, 0.9)",
                            borderRadius: "12px",
                            border: "2px solid rgba(0, 0, 0, 0.2)",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                            background: "rgba(10, 50, 100, 1)",
                        },
                    }}
                >
                    <Text type="title">
                        Agregar Mensaje de Cliente
                    </Text>

                    {/* Sección principal: dos columnas (Mensaje y Parámetros) */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Columna izquierda: Datos del mensaje */}
                        <div className="flex-1">
                            <Text type="subtitle">
                                Título del Mensaje
                            </Text>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    placeholder="Ingrese el Título del Cliente"
                                    className="mt-1 text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {formErrors.titulo && (
                                    <span className="text-red-500 text-sm">
                                        * Este campo es obligatorio
                                    </span>
                                )}
                            </div>

                            <Text type="subtitle">Mensaje</Text>

                            <div className="mb-4">
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Escribe el mensaje"
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                        </div>

                        {/* Columna derecha: Parámetros (con scroll independiente) */}
                        <div className="w-full md:w-1/3 border-l pl-4 max-h-80 overflow-y-auto">
                            <div className="mb-4 flex items-center">
                                <Buttons onClick={handleOpenParamModal} variant="create" label="Agregar Parámetro" />
                            </div>

                            {/* Modal anidado para crear un parámetro */}
                            <Modal open={paramModalOpen} onClose={handleCloseParamModal}>
                                <Box className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-20">
                                    <Text type="title">
                                        Crear Parámetro
                                    </Text>
                                    <input
                                        type="text"
                                        name="titulo"
                                        value={newParamName}
                                        onChange={(e) => setNewParamName(e.target.value)}
                                        placeholder="Parámetro requerido"
                                        className="mt-1 text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="titulo"
                                        value={newParamLabel}
                                        onChange={(e) => setNewParamLabel(e.target.value)}
                                        placeholder="Nombre del Parámetro"
                                        className="mt-1 text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <div className="flex justify-center gap-2">
                                        <Buttons onClick={handleCloseParamModal} variant="cancel" />
                                        <Buttons onClick={handleSaveParam} variant="save" />
                                    </div>
                                </Box>
                            </Modal>

                            <div className="mt-5">
                                <Text type="subtitle">
                                    Seleccionar Variables
                                </Text>
                                <div
                                    className="grid"
                                    style={{
                                        gridTemplateColumns:
                                            "repeat(auto-fill, minmax(100px, 1fr))",
                                        gap: "8px",
                                    }}
                                >
                                    {Array.isArray(availableVariables) &&
                                        availableVariables.map((param) => (
                                            <button
                                                key={param.name}
                                                onClick={() => handleInsertVariable(param.name)}
                                                className="px-3 py-2 border border-blue-500 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-500 hover:text-white transition"
                                            >
                                                {param.label}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección inferior: Otros campos y acciones */}
                    <div className="mt-6">
                        <Text type="subtitle">
                            Nombre del Cliente
                        </Text>
                        <div className="mb-4">
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                disabled
                                className="mt-1 text-center block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>
                        <Text type="subtitle">
                            Código Cliente
                        </Text>
                        <div className="mb-4">
                            <input
                                type="text"
                                name="codigo"
                                value={formData.codigo}
                                onChange={handleChange}
                                disabled
                                className="mt-1 text-center block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>
                        <Text type="subtitle">
                            URL
                        </Text>
                        <div className="mb-4">
                            <select
                                name="api_url"
                                value={formData.api_url}
                                onChange={handleChange}
                                className="mt-1 text-center block w-full rounded-md border-gray-300 p-2"
                            >
                                <option value="">Seleccionar</option>
                                {urlApi.map((url, index) => (
                                    <option key={index} value={url}>
                                        {url}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Text type="subtitle">
                            Estado del Cliente
                        </Text>
                        <div className="mb-4">
                            <select
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 p-2 text-center"
                            >
                                <option value="">Seleccionar</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>
                        <div className="flex justify-center gap-2">
                            <Buttons onClick={handleClose} variant="cancel" />
                            <Buttons onClick={handleSave} variant="save" />
                        </div>
                    </div>
                </Box>
            </Modal>

        </>
    );
};

export default ModalAgregarNotificacion;
