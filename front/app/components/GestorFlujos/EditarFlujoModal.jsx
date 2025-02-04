"use client";
import { Box, Button, IconButton, Modal, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import Toast from '../toastr/toast';

const EditarFlujoModal = () => {
    const [open, setOpen] = useState(false);
    const [nombreFlujo, setNombreFlujo] = useState('');
    const [cliente, setCliente] = useState('');
    const [estado, setEstado] = useState('');
    const [formErrors, setFormErrors] = useState({
        nombreFlujo: false,
        cliente: false,
        estado: false,
    });
    const [toast, setToast] = useState({
        show: false,
        type: '',
        message: '',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormErrors({ nombreFlujo: false, cliente: false, estado: false });
    };

    const router = useRouter();

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => {
            setToast({ show: false, type: '', message: '' });
        }, 3000);
    };

    const handleSave = () => {
        const errors = {
            nombreFlujo: !nombreFlujo,
            cliente: !cliente,
            estado: !estado,
        };
        setFormErrors(errors);

        if (errors.nombreFlujo || errors.cliente || errors.estado) {
            return;
        }

        console.log('Datos guardados:', { nombreFlujo, cliente, estado });

        handleClose();

        setNombreFlujo('');
        setCliente('');
        setEstado('');

        setTimeout(() => {
            showToast('success', 'Los datos se han guardado correctamente.');
        }, 300);

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
                <Box className="modal-container">
                    <Typography variant="h6" component="h1">
                        Editar Flujo
                    </Typography>

                    <div className="options">
                        <label className="form-label-2">Nombre Flujo</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Escriba la clave del usuario"
                                value={nombreFlujo}
                                onChange={(e) => setNombreFlujo(e.target.value)}
                            />
                            {formErrors.nombreFlujo && (
                                <span className="error-message" style={{ color: 'red' }}>
                                    * Este campo es obligatorio
                                </span>
                            )}
                        </div>

                        <label className="form-label-2">Cliente</label>
                        <div className="input-group">
                            <select
                                className="form-select"
                                value={cliente}
                                onChange={(e) => setCliente(e.target.value)}
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="1">Opción 1</option>
                                <option value="2">Opción 2</option>
                            </select>
                            {formErrors.cliente && (
                                <span className="error-message" style={{ color: 'red' }}>
                                    * Este campo es obligatorio
                                </span>
                            )}
                        </div>

                        <label className="form-label-2">Estado</label>
                        <div className="input-group">
                            <select
                                className="form-select"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="1">Activo</option>
                                <option value="2">Inactivo</option>
                            </select>
                            {formErrors.estado && (
                                <span className="error-message" style={{ color: 'red' }}>
                                    * Este campo es obligatorio
                                </span>
                            )}
                        </div>

                        <div className="buttons">
                            <Button variant="contained" color="error" onClick={handleClose}>
                                Cerrar
                            </Button>
                            <Button variant="contained" color="success" onClick={handleSave}>
                                Guardar
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>

            {toast.show && <Toast type={toast.type} message={toast.message} />}
        </>
    );
};

export default EditarFlujoModal;
