"use client";
import React, { useState, useEffect } from 'react';
import { Button, TextField, Modal, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Services from "../../services/EditarMensajes/GestorEditorMensajes";

const ModalAgregarApi = () => {
    const [open, setOpen] = useState(false);
    const [apiUrl, setApiUrl] = useState('');
    const [error, setError] = useState(false);
    const [estado, setEstado] = useState('true'); // Estado para manejar si la API es activa o inactiva
    const [number, setNumber] = useState(''); // Estado para manejar si la API es activa o inactiva

    // Función para abrir el modal
    const handleOpen = () => setOpen(true);

    // Función para cerrar el modal
    const handleClose = () => {
        setOpen(false);
        setApiUrl('');
        setError(false);
    };

    // Función para guardar la nueva URL de la API
    const handleGuardar = async () => {
        if (!apiUrl) {
            setError(true);
            return;
        }
    
        try {
            const response = await Services.saveWhatsappApi({
                api_url: apiUrl,
                estado: estado === 'activo' ? 1 : 0,
                number_test: number,
            });
            alert('API URL guardada correctamente');
            setOpen(false); 
        } catch (err) {
            console.error('Error al guardar el estado del whatsapp Api:', err);
        }
    };
    
    

    return (
        <div>
            <Button onClick={handleOpen}>Agregar API URL</Button>

            {/* Modal para agregar nueva URL de la API */}
            <Modal open={open} onClose={handleClose}>
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                        <Typography variant="h6" component="h2">
                            Agregar Nueva API URL
                        </Typography>
                        <TextField
                            label="API URL"
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                            fullWidth
                            margin="normal"
                            error={error}
                            helperText={error && "Este campo es obligatorio"}
                        />
                        {/* Select para el estado de la API */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Estado de la API</InputLabel>
                            <Select
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                label="Estado de la API"
                            >
                                <MenuItem value="activo">Activo</MenuItem>
                                <MenuItem value="inactivo">Inactivo</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Numero de prueba"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            fullWidth
                            margin="normal"
                            error={error}
                            helperText={error && "Este campo es obligatorio"}
                        />
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button onClick={handleClose} className="bg-gray-300 text-black hover:bg-gray-400">
                                Cancelar
                            </Button>
                            <Button onClick={handleGuardar} className="bg-blue-500 text-white hover:bg-blue-600">
                                Guardar
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ModalAgregarApi;
