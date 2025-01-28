import React, { useEffect } from 'react';
import HistoricoConfig from './HistoricoConfig';
import { useNavigate } from 'react-router-dom';
import ModalVerificacionUsuario from './ModalVerificacionUsuario';

const ConfigDatos = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el token existe en localStorage
    const token = localStorage.getItem('token');
    setError("Estás autenticado.");

    if (!token) {
      // Si no hay token, redirigir al login
      navigate('/login');
      setError("No estás autenticado.");
    }
  }, [navigate]);

  return (
    <div>
      <div className='header'>
        <h1>Configuración de datos de la API de Whatsapp</h1>
        <ModalVerificacionUsuario />
      </div>
      <div className='content'>
        <HistoricoConfig />
      </div>
    </div>
  );
};

export default ConfigDatos;
