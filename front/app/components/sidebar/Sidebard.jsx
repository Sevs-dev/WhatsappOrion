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
      className={`flex flex-col h-screen bg-gray-800/90 text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
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
      <div className="flex justify-center p-4">
        {!isCollapsed ? (
          <img src="/logo.png" alt="Logo" className="w-32 h-auto" />
        ) : (
          <img
            src="https://via.placeholder.com/50x50"
            alt="Logo colapsado"
            className="w-10 h-10 rounded-full"
          />
        )}
      </div>

      {/* Sidebar Menu */}
      <div className="flex flex-col flex-grow p-4 space-y-2">
        <div className="flex items-center p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200">
          <HomeIcon className="mr-2" />
          {!isCollapsed && <span>Inicio</span>}
        </div>

        <hr className="border-gray-700 my-2" />

        {!isCollapsed && (
          <p className="text-sm text-gray-400 uppercase tracking-wider">Menú principal</p>
        )}

        <Link href="/dashboard/gestorClientes" className="flex items-center p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200">
          <EmailIcon className="mr-2" />
          {!isCollapsed && <span>Gestor de mensajes</span>}
        </Link>

        <Link href="/dashboard/gestorFlujos" className="flex items-center p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200">
          <TimelineIcon className="mr-2" />
          {!isCollapsed && <span>Gestor de flujos</span>}
        </Link>

        <Link href="/ConfigDatos" className="flex items-center p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200">
          <SettingsIcon className="mr-2" />
          {!isCollapsed && <span>Configuración</span>}
        </Link>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 bg-gray-900/50">
        <div className="flex items-center">
          <Avatar
            alt="User"
            src="https://via.placeholder.com/50"
            className="w-8 h-8 rounded-full"
          />
          {!isCollapsed && (
            <div className="ml-2">
              <p className="text-sm font-medium">Joe Doe</p>
              <p className="text-xs text-gray-400">Ingeniero de software</p>
            </div>
          )}
        </div>

        {/* Botón de Cerrar Sesión */}
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
          >
            <LogoutIcon className="mr-2" />
            {!isCollapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;