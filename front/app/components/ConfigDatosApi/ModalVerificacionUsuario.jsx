import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/navigation';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 460,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ModalVerificacionUsuario = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const router = useRouter();

    return (
        <div>
            <Button onClick={handleOpen} variant="contained" color="primary">
                Nueva Configuracion
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className='modal-container'>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Verificacion de Usuario
                        </Typography>
                        <div className='options'>
                            <Typography variant="body1" component="label" className='form-label-2'>
                                Clave de usuario
                            </Typography>
                            <div className='input-group'>
                                <input
                                    type="text"
                                    className='form-control'
                                    placeholder='Escriba la clave del usuario'
                                />
                            </div>
                            <div className='buttons'>
                                <Button variant="contained" color='error' onClick={handleClose}>
                                    Cerrar
                                </Button>
                                <Button variant="contained" color='success' onClick={() => router.push('/dashboard/nuevaConfiguracion')}>
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
