import React, { useState, useEffect } from 'react';
import { Box, Button, Modal } from '@mui/material';
import ClientApiService from '../../services/GestorCliente/ClientApiService';
import Toast from '../toastr/toast';
import debounce from 'lodash.debounce';
import Text from '../text/Text'
import Buttons from '../button/Button'
import '../toastr/toast.css';

const ModalCrearCliente = ({ onClientCreated }) => {
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        estado: 1,
    });
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await ClientApiService.getClients();
                setClients(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching clients:', error);
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const handleClientSearch = debounce((inputValue) => {
        if (!inputValue) {
            setFormData(prev => ({
                ...prev,
                codigo: '',
                nombre: '',
            }));
            return;
        }

        const matchedClient = clients.find(client =>
            client.codigo_cliente.includes(inputValue) ||
            client.descripcion_cliente.toLowerCase().includes(inputValue.toLowerCase())
        );

        setFormData(prev => ({
            ...prev,
            codigo: matchedClient ? matchedClient.codigo_cliente : inputValue,
            nombre: matchedClient ? matchedClient.descripcion_cliente : prev.nombre,
        }));
    }, 500);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (name === 'codigo') {
            handleClientSearch(value);
        }
    };

    const handleSave = async () => {
        try {
            await ClientApiService.createClient(formData);
            handleClose();
            setFormData({ codigo: '', nombre: '', estado: 1 });
            setToast({
                show: true,
                type: 'success',
                message: `El cliente "${formData.nombre}" se ha creado con éxito.`,
            });
            if (onClientCreated) onClientCreated();
        } catch (error) {
            console.error('Error creando cliente:', error);
            setToast({
                show: true,
                type: 'failure',
                message: 'Hubo un problema al crear el cliente. Intenta nuevamente.',
            });
        } finally {
            setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
        }
    };

    return (
        <div>
            {toast.show && <Toast type={toast.type} message={toast.message} />}
            <Buttons onClick={handleOpen} variant="create" label="Crear Cliente" />
            <Modal open={open} onClose={handleClose}>
                <Box className="flex items-center justify-center min-h-screen p-4">
                    <Box className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                        <Text type="title">
                            Agregar Cliente
                        </Text>
                        <div className="space-y-4">
                            {/* Código del Cliente */}
                            <div>
                                <Text type="subtitle">
                                    Código del Cliente
                                </Text>
                                <div>
                                    <input
                                        type="text"
                                        className="border border-gray-300 p-2 rounded w-full"
                                        placeholder="Escriba el código del cliente"
                                        name="codigo"
                                        value={formData.codigo}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Nombre del Cliente */}
                            <div>
                                <Text type="subtitle">
                                    Nombre del Cliente
                                </Text>
                                <div>
                                    <input
                                        type="text"
                                        className="border border-gray-300 p-2 rounded w-full"
                                        placeholder="Nombre del cliente"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Estado */}
                            <div>
                                <Text type="subtitle">
                                    Estado
                                </Text>
                                <div>
                                    <select
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                        className="border border-gray-300 p-2 rounded w-full"
                                    >
                                        <option value={1}>Activo</option>
                                        <option value={0}>Inactivo</option>
                                    </select>
                                </div>
                            </div>

                            {/* Botones */}

                            <div className="flex justify-center gap-2">
                                <Buttons onClick={handleClose} variant="cancel" />
                                <Buttons onClick={handleSave} variant="save" />
                            </div>
                        </div>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalCrearCliente;