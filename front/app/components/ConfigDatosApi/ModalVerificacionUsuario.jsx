import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';


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
const navigate = useNavigate();

  return (
    <div>
        <button onClick={handleOpen} className='btn btn-primary'>Nueva Configuracion</button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className='modal-container'>
                 
                    <h1>Verificacion de Usuario</h1>
                    

                    <div className='options'>
                        <label className='form-label-2'>Clave de usuario</label>
                        <div className='input-group'>
                            <input type="text" 
                            className='form-control' 
                            aria-describedby='basic-addon3 basic-addon4'
                            placeholder='Escriba la clave del usuario'
                            />
                        </div>

                        <div className='buttons'>
                            <Button variant="contained" color='error'>Cerrar</Button>
                            <Button variant="contained" color='success' onClick={() => navigate(`/NuevaConfig` )}>Guardar</Button>
                        </div>
                    </div>
                </div>
            </Box>

        </Modal>
    </div>
  )
}

export default ModalVerificacionUsuario