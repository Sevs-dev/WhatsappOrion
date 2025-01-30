import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import ClientApiService from '../../services/GestorCliente/ClientApiService';

const FormularioEdicion = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    id_mensaje_whatsapp: '',
    titulo: '',
    descripcion: '',
    url: '',
    estado: '',
    numero_variables_mensajes: '',
    id_cliente_whatsapp: '',
    checkboxChecked: false,
  });

  useEffect(() => {
    if (location.state) {
      setFormData({
        ...location.state,
        checkboxChecked: !!location.state.url, // Inicializa el estado del checkbox
      });
    }
  }, [location.state]);

  const handleChange = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setFormData((prevData) => ({
      ...prevData,
      checkboxChecked: isChecked,
      url: isChecked ? prevData.url : '',
    }));
  };

  const handleSave = async () => {
    if (!formData.titulo || !formData.descripcion) {
      Swal.fire({
        title: 'Campos Vacíos',
        text: 'Por favor completa los campos obligatorios antes de guardar.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    const payload = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      check_url: formData.checkboxChecked,
      id_url: formData.checkboxChecked ? parseInt(formData.url, 10) : 0,
      estado_flujo_activacion: formData.estado === '1',
      id_cliente_whatsapp: formData.id_cliente_whatsapp,
    };

    console.log(payload);

    try {
      await ClientApiService.updateMessage(formData.id_mensaje_whatsapp, payload);
      Swal.fire({
        title: 'Éxito',
        text: 'El mensaje fue actualizado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } catch (error) {
      console.error('Error actualizando mensaje:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al actualizar el mensaje. Intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return (
    <div className="content">
      <div >
        <div >
          <div className="options">
            <label >ID</label>
            <div className="input-group">
              <input
                type="text"
                value={formData.id_mensaje_whatsapp || 'No disponible'}
                disabled
              />
            </div>
          </div>

          <div className="options">
            <label >ID Cliente WhatsApp</label>
            <div className="input-group">
              <input
                type="text"
                value={formData.id_cliente_whatsapp || ''}
                onChange={handleChange('id_cliente_whatsapp')}
                disabled
              />
            </div>
          </div>

          <div className="options">
            <label >Título</label>
            <div className="input-group">
              <input
                type="text"
                value={formData.titulo}
                onChange={handleChange('titulo')}
              />
            </div>
          </div>

          <div className="options">
            <label >Descripción</label>
            <div className="input-group">
              <textarea
                value={formData.descripcion}
                onChange={handleChange('descripcion')}
              ></textarea>
            </div>
          </div>

          <div className="options-checkbox">
            <div className="input-group">
              <input
                type="checkbox"
                checked={formData.checkboxChecked}
                onChange={handleCheckboxChange}
              />
              <label>La notificación tendrá URL</label>
            </div>
          </div>

          {formData.checkboxChecked && (
            <div className="options">
              <label >URL</label>
              <div className="input-group">
                <select
                  value={formData.url}
                  onChange={handleChange('url')}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="1">URL 1</option>
                  <option value="2">URL 2</option>
                </select>
              </div>
            </div>
          )}

          <div className="options">
            <label className="form-label-2">Estado</label>
            <select
              value={formData.estado}
              onChange={handleChange('estado')}
            >
              <option value="">Seleccione una opción</option>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>



          <Button variant="contained" color="success" onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormularioEdicion;
