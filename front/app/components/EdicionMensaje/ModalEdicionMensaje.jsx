'use client';
import { Box, Button, Modal, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Toast from '../toastr/toast';
import ClientApiService from '../../services/GestorCliente/ClientApiService'; // Importa el servicio para actualizar el mensaje

const ModalEdicionMensaje = ({ mensaje, onClose, onUpdate }) => {
  const [open, setOpen] = useState(true); // El modal se abre automáticamente cuando se monta
  const [toast, setToast] = useState({
    show: false,
    type: '', // Puede ser 'success' o 'failure'
    message: '', // El mensaje que muestra el toast
  });
  const [formErrors, setFormErrors] = useState({
    titulo: false,
    descripcion: false,
  });

  const [formData, setFormData] = useState({
    titulo: mensaje?.titulo || '',
    descripcion: mensaje?.descripcion || '',
    estado_flujo_activacion: mensaje?.estado_flujo_activacion === 1, // Convertir a booleano
    check_url: mensaje?.check_url || false,
    id_url: mensaje?.id_url || '',
  });

  useEffect(() => {
    if (mensaje) {
      setFormData({
        titulo: mensaje.titulo,
        descripcion: mensaje.descripcion,
        estado_flujo_activacion: mensaje.estado_flujo_activacion === 1, // Convertir a booleano
        check_url: mensaje.check_url,
        id_url: mensaje.id_url,
      });
    }
  }, [mensaje]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value, // Maneja checkboxes y otros inputs
    }));
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: false,
      }));
    }
  };

  const handleSave = async () => {
    const errors = {
      titulo: !formData.titulo,
      descripcion: !formData.descripcion,
    };
    setFormErrors(errors);

    if (errors.titulo || errors.descripcion) {
      return;
    }

    try {
      // Preparamos los datos para enviar al backend
      const payload = {
        ...formData,
        estado_flujo_activacion: formData.estado_flujo_activacion ? 1 : 0, // Convertir a número (1 o 0)
      };

      // Llamamos al servicio para actualizar el mensaje
      const updatedMessage = await ClientApiService.updateMessage(mensaje.id, payload);
      
      // Mostramos un toast de éxito
      setToast({
        show: true,
        type: 'success',
        message: `El mensaje "${formData.titulo}" se ha actualizado con éxito.`,
      });

      // Llamamos a la función onUpdate para actualizar la lista de mensajes en el componente padre
      onUpdate(updatedMessage);

      // Cerramos el modal
      onClose();
    } catch (error) {
      console.error('Error actualizando el mensaje:', error);
      setToast({
        show: true,
        type: 'failure',
        message: 'Hubo un problema al actualizar el mensaje. Intenta nuevamente.',
      });
    } finally {
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    }
  };

  return (
    <div>
      {toast.show && <Toast type={toast.type} message={toast.message} />}

      <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          className="modal-container"
          sx={{
            maxWidth: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px', // Un poco más ancho para mejor visibilidad
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '12px', // Más redondeado
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(15, 63, 120, 0.9)', // Azul más oscuro
              borderRadius: '12px', // Más redondeado
              border: '2px solid rgba(0, 0, 0, 0.2)', // Borde para que se fusione con el modal
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(10, 50, 100, 1)', // Aún más oscuro al hacer hover
            },
          }}
        >
          <h1>Editar Mensaje</h1>
          <div className="options">
            <label>Título</label>
            <div className="input-group">
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Escribe el título"
              />
              {formErrors.titulo && (
                <span className="error-message" style={{ color: 'red' }}>
                  * Este campo es obligatorio
                </span>
              )}
            </div>

            <label>Descripción</label>
            <div className="input-group">
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Escribe la descripción"
                rows={4} // Puedes ajustar el número de filas iniciales
                className="resize-y p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formErrors.descripcion && (
                <span className="error-message text-red-500 text-sm">
                  * Este campo es obligatorio
                </span>
              )}
            </div>

            <label>Estado de Flujo de Activación</label>
            <div className="input-group">
              <select
                name="estado_flujo_activacion"
                value={formData.estado_flujo_activacion ? 1 : 0} // Convertir a número para el select
                onChange={(e) => {
                  const value = e.target.value === '1'; // Convertir a booleano
                  setFormData((prevState) => ({
                    ...prevState,
                    estado_flujo_activacion: value,
                  }));
                }}
              >
                <option value={1}>Activado</option>
                <option value={0}>Desactivado</option>
              </select>
            </div>

            <label>Check URL</label>
            <div className="input-group">
              <select
                name="check_url"
                value={formData.check_url}
                onChange={handleChange}
              >
                <option value={true}>Sí</option>
                <option value={false}>No</option>
              </select>
            </div>

            <div className="buttons">
              <Button variant="contained" color="error" onClick={onClose}>
                Cerrar
              </Button>
              <Button variant="contained" color="success" onClick={handleSave}>
                Guardar
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalEdicionMensaje;