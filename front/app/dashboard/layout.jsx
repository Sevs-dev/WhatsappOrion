'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import Sidebar from '../components/sidebar/Sidebard';
import Toast from '../components/toastr/toast';

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
      // setToast({
      //   show: true,
      //   type: 'success',
      //   message: 'Inicio de sesión correcto.',
      // });
      // setTimeout(() => {
      //   setToast({ show: false, type: '', message: '' });
      // }, 3000);
    }
  }, [router]);

  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
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
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}  // Pasar la función de logout
      />

      <div className="flex-grow overflow-y-auto p-6">
        {children}
      </div>

      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}