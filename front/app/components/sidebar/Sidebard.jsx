import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import TimelineIcon from '@mui/icons-material/Timeline';
import EmailIcon from '@mui/icons-material/Email';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [userName, setUserName] = useState(""); // Inicializado como cadena vacía
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedUserData = localStorage.getItem('userData');
    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userData');
    setUser(null);
    setUserName("");
    router.push('/login');
  };

  return (
    <div
      className={`flex flex-col h-screen bg-gray-800/40 backdrop-blur-md shadow-lg rounded-r-xl text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Sidebar Header */}
      <div className="flex justify-end p-4">
        <IconButton
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          aria-expanded={!isCollapsed}
          className="hover:bg-[rgba(26,82,118,0.9)] rounded-full transition-all"
        >
          <MenuIcon className="text-white" />
        </IconButton>
      </div>

      {/* Sidebar Logo */}
      <div className="sidebar-logo mb-8 flex justify-center">
        <img
          src="/logo.png"
          alt={isCollapsed ? 'Logo colapsado' : 'Logo'}
          className={`transition-all duration-300 ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'}`}
        />
      </div>

      {/* Sidebar Menu */}
      <div className="sidebar-menu flex-1">
        <Link
          href="/dashboard/home"
          className="menu-link flex items-center space-x-4 py-3 px-4 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all"
        >
          <HomeIcon className="icon text-white" />
          {!isCollapsed && <span>Inicio</span>}
        </Link>

        <hr className="divider my-4 border-t border-gray-500 mx-4" />

        {!isCollapsed && (
          <p className="menu-title text-sm text-gray-400 mb-6 px-4">Menú principal</p>
        )}

        <Link
          href="/dashboard/gestorClientes"
          className="menu-link flex items-center space-x-4 py-3 px-4 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all"
        >
          <EmailIcon className="icon text-white" />
          {!isCollapsed && <span>Gestor de mensajes</span>}
        </Link>

        <Link
          href="/dashboard/gestorFlujos"
          className="menu-link flex items-center space-x-4 py-3 px-4 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all"
        >
          <TimelineIcon className="icon text-white" />
          {!isCollapsed && <span>Gestor de flujos</span>}
        </Link>

        <Link
          href="/dashboard/configDatos"
          className="menu-link flex items-center space-x-4 py-3 px-4 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all"
        >
          <SettingsIcon className="icon text-white" />
          {!isCollapsed && <span>Configuración</span>}
        </Link>
      </div>

      {/* Sidebar Footer */}
      <div className={`sidebar-footer ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="user-info flex items-center space-x-4 py-4 px-4">
          <Avatar
            alt="User"
            src={userName?.avatarUrl || "https://via.placeholder.com/50"}
            className={`transition-all duration-300 ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'}`}
          />
          {!isCollapsed && (
            <div>
              <p className="user-name text-sm font-medium">
                {userName || 'Invitado'} {/* Muestra "Invitado" si no hay nombre de usuario */}
              </p>
              <p className="user-role text-xs text-gray-400">Ingeniero de software</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-6 w-full">
          <button
            onClick={handleLogout}
            className="menu-link flex items-center space-x-4 py-3 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all"
          >
            <LogoutIcon className="mr-6" />
            {!isCollapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;