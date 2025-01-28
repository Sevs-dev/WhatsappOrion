import { Box, Modal, Typography } from '@mui/material';
import React from 'react'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  borderRadius: 12,
  p: 4,
};



const ModalFlujoVentana = () => {
const [open, setOpen] = React.useState(false);
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);

  return (
    <div>
        <button onClick={handleOpen} className='btn btn-primary'>Proceso #</button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className='modal-container'>
                    
                </div>
            </Box>

        </Modal>
    </div>
  )
}

export default ModalFlujoVentana