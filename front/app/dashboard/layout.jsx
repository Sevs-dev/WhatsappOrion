'use client';
import { useEffect, useState } from 'react'; // Importa useState
import { useRouter } from 'next/navigation';
import React from 'react';
import Sidebar from '../components/sidebar/Sidebard'; // Asegúrate de que el nombre sea correcto
import Toast from '../components/toastr/toast'; // Importa el componente Toast

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: '',
    message: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      // Mostrar el Toast de éxito cuando el usuario es redirigido al dashboard
      setToast({
        show: true,
        type: 'success',
        message: 'Inicio de sesión correcto.',
      });
      setTimeout(() => {
        setToast({ show: false, type: '', message: '' });
      }, 3000);
    }
  }, [router]);

  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  return (
    <div
      className="flex h-screen"
      style={{
        backgroundImage: 'url("/fondop1.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Barra lateral */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      {/* Contenido principal */}
      <div className="flex-grow overflow-y-auto p-6">
        {children}
      </div>

      {/* Mostrar el Toast si es necesario */}
      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}