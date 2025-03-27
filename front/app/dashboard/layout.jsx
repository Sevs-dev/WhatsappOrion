'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar/Sidebard';
import Toast from '../components/toastr/toast';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  return (
    <div className="relative flex h-screen">
      {/* Fondo con imagen */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/fondop1.jpg")' }}
      />

      {/* Capa de desenfoque */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-lg" />

      {/* Contenido encima del fondo borroso */}
      <div className="relative z-10 flex flex-grow">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} handleLogout={handleLogout} />
        <main className="flex-grow overflow-y-auto p-2">{children}</main>
      </div>

      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </div>

  );
}