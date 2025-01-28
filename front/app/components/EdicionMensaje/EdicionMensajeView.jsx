import React, { useEffect, useState } from 'react';
import FormularioEdicion from './FormularioEdicion';
import ModalEdicionMensaje from './ModalEdicionMensaje';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import ClientApiService from '../../services/GestorCliente/ClientApiService';

const EdicionMensajeView = () => {
  const location = useLocation();
  const initialData = location.state || {
    id_mensaje_whatsapp: '',
    titulo: '',
    descripcion: '',
    id_url: '',
    estado: '',
  };

  const [formData, setFormData] = useState(initialData);

  return (
    <div>
      <div className="header">
        <h1>Edición de Mensaje WhatsApp</h1>
        <div className="buttons-container">
          <ModalEdicionMensaje formData={formData} />
        </div>
      </div>
      <div>
        <FormularioEdicion/>
      </div>
    </div>
  );
};

export default EdicionMensajeView;
