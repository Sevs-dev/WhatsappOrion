"use client";
import { Box, Button, IconButton, Modal, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    borderRadius: 12,
    p: 4,
};
const EditarFlujoModal = () => {
    const [open, setOpen] = useState(false);
    const [nombreFlujo, setNombreFlujo] = useState('');  // Estado para "Nombre Flujo"
    const [cliente, setCliente] = useState(''); // Estado para "Cliente"
    const [estado, setEstado] = useState(''); // Estado para "Estado"
    const [toast, setToast] = useState({
        show: false,
        type: '',
        message: '',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const router = useRouter(); // Use Next.js's useRouter

    // Función para mostrar el toast
    const showToast = (type, message) => {
        console.log('Toast: ', type, message); // Agregado para depuración
        setToast({ show: true, type, message });
        setTimeout(() => {
            setToast({ show: false, type: '', message: '' });
        }, 3000); // Duración del toast
    };
    // Función para guardar los datos
    const handleSave = () => {
        console.log('Validando datos...'); // Agregado para depuración
        // Verificar que los campos no estén vacíos
        if (!nombreFlujo || !cliente || !estado) {
            showToast('failure', 'Por favor, complete todos los campos.');
            return; // Detener la ejecución si falta algún campo
        }

        // Si todos los campos están completos, guardamos los datos (aquí puedes agregar lógica para enviar a una API)
        console.log('Datos guardados:', { nombreFlujo, cliente, estado });

        // Luego redirigimos
        router.push('/dashboard/nuevaConfiguracion');
    };

    return (
        <>
            <Tooltip title="Editar">
                <IconButton onClick={handleOpen} color="primary">
                    <EditIcon />
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
                        <Typography variant="h6" component="h2">
                            Editar Flujo
                        </Typography>

                        <div className="options">
                            <label className="form-label-2">Nombre Flujo</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    aria-describedby="basic-addon3 basic-addon4"
                                    placeholder="Escriba la clave del usuario"
                                    value={nombreFlujo}
                                    onChange={(e) => setNombreFlujo(e.target.value)} // Actualiza el estado
                                />
                            </div>

                            <label className="form-label-2">Cliente</label>
                            <div className="input-group">
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    value={cliente}
                                    onChange={(e) => setCliente(e.target.value)} // Actualiza el estado
                                >
                                    <option value="">Seleccione una opción</option> {/* Asegurarse de que haya un valor vacío */}
                                    <option value="1">Opción 1</option>
                                    <option value="2">Opción 2</option>
                                </select>
                            </div>

                            <label className="form-label-2">Estado</label>
                            <div className="input-group">
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)} // Actualiza el estado
                                >
                                    <option value="">Seleccione una opción</option> {/* Asegurarse de que haya un valor vacío */}
                                    <option value="1">Activo</option>
                                    <option value="2">Inactivo</option>
                                </select>
                            </div>

                            <div className="buttons">
                                <Button variant="contained" color="error" onClick={handleClose}>
                                    Cerrar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSave} // Llama a handleSave para guardar
                                >
                                    Guardar
                                </Button>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
            {/* Aquí se muestra el toast si el estado de show es true */}
            {toast.show && (
                <div
                    style={{
                        position: 'absolute',
                        top: 10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '10px 20px',
                        backgroundColor: toast.type === 'failure' ? 'red' : 'green',
                        color: 'white',
                        borderRadius: '5px',
                    }}
                >
                    {toast.message}
                </div>
            )}
        </>
    );
};

export default EditarFlujoModal;
