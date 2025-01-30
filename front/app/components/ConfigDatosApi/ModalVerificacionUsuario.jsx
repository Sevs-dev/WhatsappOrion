import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react';
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
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const router = useRouter();

    return (
        <div>
            <button onClick={handleOpen} className='btn btn-primary'>Crear cliente</button>
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
                            <Typography variant="body1" component="label" >
                                Clave de usuario
                            </Typography>
                            <div className='input-group'>
                                <input
                                    type="text"
                                    placeholder='Escriba la clave del usuario'
                                />
                            </div>
                            <div className='buttons'>
                                <Button variant="contained" color='error' onClick={handleClose}>
                                    Cerrar
                                </Button>
                                <Button variant="contained" color='success' onClick={() => router.push('/NuevaConfig')}>
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
