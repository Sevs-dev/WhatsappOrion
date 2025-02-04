import { Box, Button, Modal, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ModalVerificacionUsuario = () => {
    const [open, setOpen] = useState(false);//Estado para manejar si el modal esta abierto o cerrado
    const [claveUsuario, setClaveUsuario] = useState('');//Almacena la clave del usuario
    const [error, setError] = useState(false);
    const router = useRouter();
//Funciones para abrir y cerrar el modal
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setClaveUsuario('');
        setError(false);
    };

    const handleGuardar = () => {
        if (!claveUsuario) { //Si no se ha ingresado la clave del usuario muestra un mensaje de error
            setError(true);
            return;
        }
        router.push('/dashboard/nuevaConfiguracion');
    };

    return (
        <div>
            <button onClick={handleOpen} className="btn btn-primary">
                Crear cliente
            </button>
            <Modal
                open={open}
                onClose={handleClose}//Cierra el modal al hacer click fuera de el
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="modal-container">
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
                                    setError(false);
                                }}
                            />
                            {error && (
                                <span className="error-message" style={{ color: 'red' }}>
                                    * Este campo es obligatorio
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
                </Box>
            </Modal>
        </div>
    );
};

export default ModalVerificacionUsuario;
