'use client';
import { Box, Button, Modal, Typography, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Toast from '../toastr/toast';
import ClientApiService from '../../services/GestorCliente/ClientApiService';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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
    estado_flujo_activacion: mensaje?.estado_flujo_activacion === 1,
    api_url: mensaje?.api_url || '',
  });

  const [availableVariables, setAvailableVariables] = useState([]); // Estado para las variables disponibles
  const [paramModalOpen, setParamModalOpen] = useState(false); // Estado para el modal de parámetros
  const [newParamName, setNewParamName] = useState(''); // Estado para el nombre del nuevo parámetro
  const [newParamLabel, setNewParamLabel] = useState(''); // Estado para el label del nuevo parámetro

  // Cargar las variables disponibles al abrir el modal
  useEffect(() => {
    const fetchParams = async () => {
      try {
        const params = await ClientApiService.getParams();
        const variables = params.data ? params.data : params; // Ajustar dependiendo de la estructura
        setAvailableVariables(Array.isArray(variables) ? variables : []);
      } catch (error) {
        console.error('Error al obtener los parámetros:', error);
      }
    };

    fetchParams();
  }, []);

  // Actualizar el estado del formulario cuando cambia el mensaje
  useEffect(() => {
    if (mensaje) {
      setFormData({
        titulo: mensaje.titulo,
        descripcion: mensaje.descripcion,
        estado_flujo_activacion: mensaje.estado_flujo_activacion === 1,
        api_url: mensaje.api_url,
      });
    }
  }, [mensaje]);

  // Manejar cambios en los campos del formulario
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

  // Guardar los cambios del mensaje
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

  // Insertar una variable en la descripción
  const handleInsertVariable = (variable) => {
    setFormData((prevState) => ({
      ...prevState,
      descripcion: `${prevState.descripcion} {{${variable}}}`,
    }));
  };

  // Manejar la creación de un nuevo parámetro
  const handleSaveParam = async () => {
    if (!newParamName || !newParamLabel) {
      setToast({
        show: true,
        type: 'failure',
        message: 'El nombre y el label del parámetro son obligatorios.',
      });
      return;
    }

    const parametros = { name: newParamName, label: newParamLabel };
    try {
      await ClientApiService.createParams(parametros);
      setToast({
        show: true,
        type: 'success',
        message: `Parámetro creado con éxito.`,
      });
      setParamModalOpen(false);
      setNewParamName('');
      setNewParamLabel('');
      // Recargar las variables disponibles
      const params = await ClientApiService.getParams();
      setAvailableVariables(params.data ? params.data : params);
    } catch (error) {
      console.error('Error creando parámetro:', error);
      setToast({
        show: true,
        type: 'failure',
        message: 'Hubo un error al crear el parámetro.',
      });
    }
  };

  return (
    <div>
      {toast.show && <Toast type={toast.type} message={toast.message} />}

      <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          className="modal-container"
          sx={{
            maxWidth: '600px',
            width: '50%',
            padding: 3,
            backgroundColor: 'white',
            maxHeight: '90vh',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(15, 63, 120, 0.9)',
              borderRadius: '12px',
              border: '2px solid rgba(0, 0, 0, 0.2)',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(10, 50, 100, 1)',
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
                rows={4}
                className="resize-y p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Estado de Flujo de Activación */}
            <label>Estado de Flujo de Activación</label>
            <div className="input-group">
              <select
                name="estado_flujo_activacion"
                value={formData.estado_flujo_activacion ? 1 : 0}
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

            {/* Check URL */}
            <label>Check URL</label>
            <div className="input-group">
              <select
                name="api_url"
                value={formData.api_url}
                onChange={handleChange}
              >
                <option value={true}>Sí</option>
                <option value={false}>No</option>
              </select>
            </div>

            {/* Botón para abrir el modal de creación de parámetros */}
            <Tooltip title="Agregar Parámetro">
              <IconButton color="primary" onClick={() => setParamModalOpen(true)}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>

            {/* Modal para crear un parámetro */}
            <Modal open={paramModalOpen} onClose={() => setParamModalOpen(false)}>
              <Box className="modal-container">
                <h2>Crear Parámetro</h2>
                <TextField
                  label="Nombre del Parámetro"
                  value={newParamName}
                  onChange={(e) => setNewParamName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Label del Parámetro"
                  value={newParamLabel}
                  onChange={(e) => setNewParamLabel(e.target.value)}
                  fullWidth
                />
                <Button variant="contained" color="primary" onClick={handleSaveParam}>
                  Guardar Parámetro
                </Button>
                <Button variant="outlined" color="error" onClick={() => setParamModalOpen(false)}>
                  Cancelar
                </Button>
              </Box>
            </Modal>

            {/* Mostrar las variables disponibles */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Variables Disponibles</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                {availableVariables.map((param, index) => (
                  <Button
                    key={index}
                    onClick={() => handleInsertVariable(param.name)}
                    variant="outlined"
                    color="primary"
                    sx={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      textTransform: 'capitalize',
                      fontWeight: '400',
                      fontSize: '0.7rem',
                      boxShadow: 'none',
                      border: '1px solid #1976d2',
                      '&:hover': {
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        borderColor: '#1565c0',
                      },
                    }}
                  >
                    {param.label}
                  </Button>
                ))}
              </div>
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