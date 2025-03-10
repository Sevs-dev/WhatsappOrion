'use client';
import React, { useEffect, useState } from 'react';
import HistoricoConfig from './HistoricoConfig';
import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/navigation';
import ModalVerificacionUsuario from './ModalVerificacionUsuario';
import Loader from '../loader/Loader';

const ConfigDatos = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);//Maneja estado de efecto de carga

  useEffect(() => {
    const token = localStorage.getItem('token');//Obtiene el token del local storage
    if (!token) {
      router.push('/login');//Si no existe token redirige a la página de login 
    } else {
      // 
      setTimeout(() => {
        setLoading(false);
      }, 1000); // Simula un tiempo de carga de 1 segundo
    }
  }, [router]);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 items-center mb-4 bg-[#20415e] p-4 rounded shadow">
        <h1 className="text-2xl font-bold text-white">Configuración API de Whatsapp</h1>
        <div className="flex justify-end">
          <ModalVerificacionUsuario />
        </div>
      </div>
      <HistoricoConfig />
    </div>
  );
};

export default ConfigDatos;
