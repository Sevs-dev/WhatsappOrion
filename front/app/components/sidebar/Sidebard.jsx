import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import TimelineIcon from '@mui/icons-material/Timeline';
import EmailIcon from '@mui/icons-material/Email';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [autoCollapsed, setAutoCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setAutoCollapsed(true);
      } else {
        setAutoCollapsed(false);
      }
    };

    // Escuchar el evento resize
    window.addEventListener('resize', handleResize);

    // Llamar a handleResize al montar el componente para establecer el estado inicial
    handleResize();

    // Limpiar el evento al desmontar el componente
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userData');
    setUser(null);
    setUserName("");
    router.push('/login');
  };

  const menuItems = [
    { 
      path: '/dashboard/home', 
      icon: <HomeIcon className="icon text-white" />, 
      label: 'Inicio' 
    },
    { 
      path: '/dashboard/gestorClientes', 
      icon: <EmailIcon className="icon text-white" />, 
      label: 'Listado clientes' 
    },
    { 
      path: '/dashboard/gestorFlujos', 
      icon: <TimelineIcon className="icon text-white" />, 
      label: 'Gestor de flujos' 
    },
    { 
      path: '/dashboard/configDatos', 
      icon: <SettingsIcon className="icon text-white" />, 
      label: 'Configuración' 
    }
  ];

  return (
    <div
      className={`flex flex-col h-screen bg-gray-800/40 backdrop-blur-md shadow-lg rounded-r-xl text-white transition-all duration-300 ease-in-out ${isCollapsed || autoCollapsed ? 'w-20' : 'w-64'}`}
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
          alt={isCollapsed || autoCollapsed ? 'Logo colapsado' : 'Logo'}
          className={`transition-all duration-300 ${isCollapsed || autoCollapsed ? 'w-10 h-10' : 'w-12 h-12'}`}
        />
      </div>

      {/* Sidebar Menu */}
      <div className="sidebar-menu flex-1 px-4 py-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`menu-link flex items-center ${isCollapsed || autoCollapsed ? 'justify-center' : 'justify-start'} gap-x-4 py-3 px-4 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all relative ${pathname === item.path ? 'bg-[rgba(26,82,118,0.6)]' : ''}`}
          >
            {item.icon}
            {!isCollapsed && !autoCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
            
            {/* Indicador de módulo activo */}
            {pathname === item.path && (
              <span 
                className={`absolute transition-all duration-300 ${isCollapsed || autoCollapsed ? 'right-1' : 'right-5'} w-2 h-2 bg-yellow-500 rounded-full animate-bounce`}
                 style={{
                 boxShadow: '0 0 5px rgba(59, 130, 246, 0.7)',
                 animationDuration: '0.5s',
                 filter: isCollapsed || autoCollapsed ? 'brightness(1.5)' : 'brightness(1)',
                }}
              />
            )}
          </Link>
        ))}

        <hr className="divider my-4 border-t border-gray-500 mx-4" />

        {!isCollapsed && !autoCollapsed && (
          <p className="menu-title text-sm text-gray-400 mb-6 px-4">Menú principal</p>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className={`sidebar-footer px-4 py-2`}>
        <div className={`user-info flex items-center ${isCollapsed || autoCollapsed ? "justify-center" : "justify-start"} gap-x-4 px-4 py-2`}>
          <Avatar
            alt="User"
            src={userName?.avatarUrl || "https://via.placeholder.com/50"}
            className={`transition-all duration-300 ${isCollapsed || autoCollapsed ? 'w-12 h-12' : 'w-12 h-12'}`}
          />
          {!isCollapsed && !autoCollapsed && (
            <div>
              <p className="user-name text-sm font-medium">{userName || 'Invitado'}</p>
              <p className="user-role text-xs text-gray-400">Ingeniero de software</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-6 w-full">
          <button
            onClick={handleLogout}
            className="menu-link flex items-center space-x-4 py-4 px-4 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all"
          >
            <LogoutIcon className="mr-2" />
            {!isCollapsed && !autoCollapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;