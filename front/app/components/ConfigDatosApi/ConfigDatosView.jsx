'use client';
import React, { useEffect, useState } from 'react';
import HistoricoConfig from './HistoricoConfig';
import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/navigation';
import ModalVerificacionUsuario from './ModalVerificacionUsuario';
import Loader from '../loader/Loader';

const ConfigDatos = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      // Simula una validación del token (puedes agregar lógica adicional aquí)
      setTimeout(() => {
        setLoading(false);
      }, 1000); // Simula un tiempo de carga de 1 segundo
    }
  }, [router]);

  if (loading) {
    return <Loader />; // Muestra el componente Loader mientras se valida el token
  }

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
