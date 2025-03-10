'use client';
import { Box, Button, Modal, Typography, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Toast from '../toastr/toast';
import ClientApiService from '../../services/GestorCliente/ClientApiService';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Text from '../text/Text'
import Buttons from '../button/Button'

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

      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-10"
          sx={{
            maxHeight: "90vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-track": {
              background: "rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(15, 63, 120, 0.9)",
              borderRadius: "12px",
              border: "2px solid rgba(0, 0, 0, 0.2)",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "rgba(10, 50, 100, 1)",
            },
          }}
        >
          <Text type="title">Editar Mensaje de Cliente</Text>

          <div className="space-y-4">
            {/* Título */}
            <div>
              <Text type="subtitle">Título del Mensaje</Text>
              <div>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Escribe el título"
                  className="w-full text-center border border-gray-300 rounded p-2"
                />
                {formErrors.titulo && (
                  <span className="text-red-500 text-sm">
                    * Este campo es obligatorio
                  </span>
                )}
              </div>
            </div>

            {/* Sección principal: dos columnas (Mensaje y Parámetros) */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Columna izquierda: Datos del mensaje */}
              <div className="flex-1">
                <Text type="subtitle">Mensaje</Text>
                <div>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Escribe la descripción"
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* Columna derecha: Parámetros (con scroll independiente) */}
              <div className="w-full md:w-1/3 border-l pl-4 max-h-80 overflow-y-auto">
                {/* Botón para abrir el modal de creación de parámetros */}
                <div className="flex justify-center mb-2">
                  <Buttons onClick={() => setParamModalOpen(true)} variant="create" label="Agregar Parámetro" />
                </div>

                {/* Modal para crear un parámetro */}
                <Modal open={paramModalOpen} onClose={() => setParamModalOpen(false)}>
                  <Box className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-20">
                    <Text type="title" className="mb-4">Crear Parámetro</Text>
                    <input
                      type="text"
                      name="titulo"
                      value={newParamName}
                      onChange={(e) => setNewParamName(e.target.value)}
                      placeholder="Parámetro requerido"
                      className="mt-1 text-center block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="titulo"
                      value={newParamLabel}
                      onChange={(e) => setNewParamLabel(e.target.value)}
                      placeholder="Nombre del Parámetro"
                      className="mt-1 text-center block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <div className="flex justify-center gap-2 mt-4">
                      <Buttons onClick={() => setParamModalOpen(false)} variant="cancel" />
                      <Buttons onClick={handleSaveParam} variant="save" />
                    </div>
                  </Box>
                </Modal>

                {/* Variables Disponibles */}
                <div className="mt-5">
                  <Text type="subtitle">Variables Disponibles</Text>
                  <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "8px" }}>
                    {availableVariables.map((param, index) => (
                      <Button
                        key={index}
                        onClick={() => handleInsertVariable(param.name)}
                        variant="outlined"
                        color="primary"
                        className="px-3 py-1 border border-blue-500 text-blue-600 rounded text-xs font-normal hover:bg-blue-500 hover:text-white transition"
                      >
                        {param.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Estado de Flujo de Activación */}
            <div>
              <Text type="subtitle">Estado de Flujo</Text>
              <div>
                <select
                  name="estado_flujo_activacion"
                  value={formData.estado_flujo_activacion ? 1 : 0}
                  onChange={(e) => {
                    const value = e.target.value === '1';
                    setFormData((prevState) => ({
                      ...prevState,
                      estado_flujo_activacion: value,
                    }));
                  }}
                  className="w-full text-center border border-gray-300 rounded p-2"
                >
                  <option value={1}>Activado</option>
                  <option value={0}>Desactivado</option>
                </select>
              </div>
            </div>

            {/* Check URL */}
            <div>
              <Text type="subtitle">URL</Text>
              <div>
                <select
                  name="api_url"
                  value={formData.api_url}
                  onChange={handleChange}
                  className="w-full border text-center border-gray-300 rounded p-2"
                >
                  <option value={true}>Sí</option>
                  <option value={false}>No</option>
                </select>
              </div>
            </div>



            {/* Botones de Cerrar y Guardar */}

            <div className="flex justify-center gap-2">
              <Buttons onClick={onClose} variant="cancel" />
              <Buttons onClick={handleSave} variant="save" />
            </div>
          </div>
        </Box>
      </Modal>

    </div>
  );
};

export default ModalEdicionMensaje;