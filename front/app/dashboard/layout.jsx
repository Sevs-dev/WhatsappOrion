'use client';
import { useEffect, useState } from 'react'; // Importa useState
import { useRouter } from 'next/navigation';
import React from 'react';
import Sidebar from '../components/sidebar/Sidebard'; // Asegúrate de que el nombre sea correcto

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado para controlar el colapso

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState); // Alterna el estado de colapso
  };

  return (
    <div
      className="flex h-screen"
      style={{
        backgroundImage: 'url("/fondop1.jpg")', // Ruta de la imagen
        backgroundSize: 'cover', // Cubre toda la pantalla
        backgroundPosition: 'center', // Centra la imagen
        backgroundRepeat: 'no-repeat', // Evita que se repita
      }}
    >
      {/* Barra lateral */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      {/* Contenido principal */}
      <div className="flex-grow overflow-y-auto p-6 ">
        {children}
      </div>
    </div>
  );
}

