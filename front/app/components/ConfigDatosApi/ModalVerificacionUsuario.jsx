import { Box, Button, Modal, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    borderRadius: 12,
    p: 4,
};

const ModalVerificacionUsuario = () => {
    const [open, setOpen] = useState(false);
    const [claveUsuario, setClaveUsuario] = useState(''); // Estado para el campo "Clave de usuario"
    const [error, setError] = useState(false); // Estado para manejar errores de validación
    const router = useRouter();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setClaveUsuario(''); // Limpiar el campo al cerrar
        setError(false); // Limpiar el error al cerrar
    };

    const handleGuardar = () => {
        if (!claveUsuario) {
            setError(true); // Mostrar error si el campo está vacío
            return; // Detener la ejecución si falta el campo
        }

        // Si el campo está completo, redirigir
        router.push('/dashboard/nuevaConfiguracion');
    };

    return (
        <div>
            <button onClick={handleOpen} className="btn btn-primary">
                Crear cliente
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="modal-container">
                        <Typography variant="h4" component="h1" gutterBottom>
                            Verificación de Usuario
                        </Typography>
                        <div className="options">
                            <Typography variant="body1" component="label">
                                Clave de usuario
                            </Typography>
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Escriba la clave del usuario"
                                    value={claveUsuario}
                                    onChange={(e) => {
                                        setClaveUsuario(e.target.value);
                                        setError(false); // Limpiar el error al escribir
                                    }}
                                />
                                {error && (
                                    <span style={{ color: 'red', fontSize: '12px' }}>
                                        Este campo es obligatorio
                                    </span>
                                )}
                            </div>
                            <div className="buttons">
                                <Button variant="contained" color="error" onClick={handleClose}>
                                    Cerrar
                                </Button>
                                <Button variant="contained" color="success" onClick={handleGuardar}>
                                    Guardar
                                </Button>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalVerificacionUsuario;