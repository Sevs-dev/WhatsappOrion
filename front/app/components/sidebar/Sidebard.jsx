import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Cambia la importación aquí
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import TimelineIcon from '@mui/icons-material/Timeline';
import EmailIcon from '@mui/icons-material/Email';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const router = useRouter(); // Ahora usa el useRouter correcto

  const handleLogout = () => {
    // Eliminar el token y otros datos del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');

    // Redirigir al usuario a la página de inicio de sesión
    router.push('/login');
  };

  return (
    <div
      className={`flex flex-col h-screen bg-gray-800/90 text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'
        } shadow-lg`}
    >
      {/* Sidebar Header */}
      <div className="flex justify-end p-4">
        <IconButton
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          className="hover:bg-gray-700/50 rounded-full"
        >
          <MenuIcon className="text-white" />
        </IconButton>
      </div>

      {/* Sidebar Logo */}
      <div className="sidebar-logo mb-4">
        <img
          src="https://via.placeholder.com/50x50"
          alt={isCollapsed ? 'Logo colapsado' : 'Logo'}
          className={`transition-all duration-300 ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'
            }`}
        />
      </div>

      {/* Sidebar Menu */}
      <div className="sidebar-menu flex-1">
        <Link href="/dashboard/home" className="menu-link flex items-center space-x-3 py-2">>
          <HomeIcon className="icon text-white" />
          {!isCollapsed && <span>Inicio</span>}
        </Link>

        <hr className="divider my-2 border-t border-gray-500" />

        {!isCollapsed && (
          <p className="menu-title text-sm text-gray-400">Menú principal</p>
        )}

        <Link href="/dashboard/gestorClientes" className="menu-link flex items-center space-x-3 py-2">
          <EmailIcon className="icon text-white" />
          {!isCollapsed && <span>Gestor de mensajes</span>}
        </Link>

        <Link href="/dashboard/gestorFlujos" className="menu-link flex items-center space-x-3 py-2">
          <TimelineIcon className="icon text-white" />
          {!isCollapsed && <span>Gestor de flujos</span>}
        </Link>

        <Link href="/dashboard/configDatos" className="menu-link flex items-center space-x-3 py-2">
          <SettingsIcon className="icon text-white" />
          {!isCollapsed && <span>Configuración</span>}
        </Link>
      </div>

      {/* Sidebar Footer */}
      <div className={`sidebar-footer ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="user-info flex items-center space-x-3 py-2">
          <Avatar
            alt="User"
            src="https://via.placeholder.com/50"
            className={`transition-all duration-300 ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'}`}
          />
          {!isCollapsed && (
            <div>
              <p className="user-name text-sm font-medium">Joe Doe</p>
              <p className="user-role text-xs text-gray-400">Ingeniero de software</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
          >
            <LogoutIcon className="mr-2" />
            {!isCollapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div >
    </div >
  );
};

export default Sidebar;
