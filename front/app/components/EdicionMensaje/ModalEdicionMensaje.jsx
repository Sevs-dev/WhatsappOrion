import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react'

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



const ModalEdicionMensaje = ({ formData }) => {
const [open, setOpen] = React.useState(false);
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);

  return (
    <div>
        <button onClick={handleOpen} className='btn btn-primary'>Vista Previa</button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className='modal-container'>
                    <p>
                        <h1>Asignacion Notificacion</h1>
                    </p>

                    <div className='options'>
                        <label className='form-label-2'>Lista de Notificaciones</label>
                        <div className='input-group'>
                            <select className="form-select" aria-label="Default select example">
                                <option>Seleccione una opcion</option>
                                <option value="1">Opcion 1</option>
                                <option value="2">Opcion 2</option>
                            </select>
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

export default ModalEdicionMensaje