import React, { useState, useEffect } from 'react';
import { Box, Button, Modal } from '@mui/material';
import ClientApiService from '../../services/GestorCliente/ClientApiService';
import Toast from '../toastr/toast';
import debounce from 'lodash.debounce'; // Usamos lodash.debounce para retrasar la búsqueda
import '../toastr/toast.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ModalCrearCliente = () => {
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        estado: 1,
    });
    const [clients, setClients] = useState([]); // Nuevo estado para los clientes
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await ClientApiService.getClients(); // Obtener clientes
                setClients(data); // Establecer los clientes en el estado
                setLoading(false); // Cambiar el estado de carga a false
            } catch (error) {
                console.error('Error fetching clients:', error);
                setLoading(false); // Cambiar el estado de carga a false si hay error
            }
        };

        fetchClients();
    }, []);

    // Función de búsqueda con debounce
    const handleClientSearch = debounce((inputValue) => {
        // Si el campo está vacío, limpiamos los datos en el formulario y no hacemos la búsqueda
        if (!inputValue) {
            setFormData((prevState) => ({
                ...prevState,
                codigo: '',
                nombre: '',
            }));
            return;
        }

        // Realizamos la búsqueda solo si hay texto
        const matchedClient = clients.find(client =>
            client.codigo_cliente.includes(inputValue) || 
            client.descripcion_cliente.toLowerCase().includes(inputValue.toLowerCase())
        );

        if (matchedClient) {
            // Si se encuentra un cliente, actualizar el formulario con los datos del cliente
            setFormData((prevState) => ({
                ...prevState,
                codigo: matchedClient.codigo_cliente, // Actualiza el código del cliente
                nombre: matchedClient.descripcion_cliente, // Actualiza el nombre del cliente
            }));
        } else {
            // Si no se encuentra ningún cliente, limpiamos el nombre y código
            setFormData((prevState) => ({
                ...prevState,
                codigo: '',
                nombre: '',
            }));
        }
    }, 500); // Esperar 500ms después de que se deja de escribir

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Ejecutar la búsqueda al escribir en el input
        if (name === 'codigo') {
            handleClientSearch(value); // Pasamos el valor actual del input
        }
    };

    // Función para manejar la selección de un cliente en el select
    const handleSelectChange = (e) => {
        const selectedClientName = e.target.value;
        const selectedClient = clients.find(client => client.descripcion_cliente === selectedClientName);

        if (selectedClient) {
            setFormData({
                codigo: selectedClient.codigo_cliente, // Actualiza el código del cliente
                nombre: selectedClientName, // Actualiza el nombre del cliente
                estado: formData.estado,
            });
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
                <Toast type={toast.type} message={toast.message} />
            )}
            <button onClick={handleOpen} className='btn btn-primary'>Crear cliente</button>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <div className='modal-container'>
                        <div>
                            <h1>Agregar cliente</h1>
                        </div>
                        <div className='options'>
                            <label className='form-label-2'>Codigo Cliente</label>
                            <div className='input-group'>
                                <input
                                    type="text"
                                    className='form-control'
                                    placeholder='Escriba el código o nombre del cliente'
                                    name='codigo'
                                    value={formData.codigo}
                                    onChange={handleChange} // Ahora solo actualiza el valor
                                />
                            </div>
                            <label className='form-label-2'>Cliente</label>
                            <div className='input-group'>
                                <select
                                    className="form-select"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleSelectChange} // Ahora manejamos el cambio de select
                                    disabled={loading} // Deshabilitar mientras carga
                                >
                                    <option>Seleccione una opción</option>
                                    {clients && clients.map((client) => (
                                        <option key={client.codigo_cliente} value={client.descripcion_cliente}>
                                            {client.descripcion_cliente}
                                        </option>
                                    ))}
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
