import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { IconButton, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import TimelineIcon from '@mui/icons-material/Timeline';
import ListIcon from '@mui/icons-material/List';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [autoCollapsed, setAutoCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Combina el estado manual y el auto-colapso
  const collapsed = isCollapsed || autoCollapsed;

  // Cargar datos de usuario desde localStorage
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    } else if (storedUserName) {
      setUser({ name: storedUserName });
    }
  }, []);

  // Manejar el colapso automático en función del ancho de la ventana
  useEffect(() => {
    const handleResize = () => {
      setAutoCollapsed(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Estado inicial

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función de logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userData');
    setUser(null);
    router.push('/login');
  };

  // Lista de items del menú
  const menuItems = useMemo(() => [
    { 
      path: '/dashboard/home', 
      icon: <HomeIcon className="icon text-white" />, 
      label: 'Inicio' 
    },
    { 
      path: '/dashboard/gestorClientes', 
      icon: <ListIcon className="icon text-white" />, 
      label: 'Listado clientes' 
    },
    { 
      path: '/dashboard/gestorFlujos', 
      icon: <TimelineIcon className="icon text-white" />, 
      label: 'Gestor de flujos' 
    },
    { 
      path: '/dashboard/configDatos', 
      icon: <EmailIcon className="icon text-white" />, 
      label: 'Envió de Mensajes' 
    }
  ], []);

  // Componente divider reutilizable
  const DividerWithText = ({ text }) => (
    <div className="flex items-center px-4 ">
      <div className="flex-grow border-t border-gray-400"></div>
      <span className="mx-2 text-xs text-gray-400">{text}</span>
      <div className="flex-grow border-t border-gray-400"></div>
    </div>
  );

  return (
    <div
      className={`flex flex-col h-screen bg-gray-800/40 backdrop-blur-md shadow-lg rounded-r-xl text-white transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Sidebar Header */}
      <div className="flex justify-end p-4">
        <IconButton
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          aria-expanded={!collapsed}
          className="hover:bg-[rgba(26,82,118,0.9)] rounded-full transition-all"
        >
          <MenuIcon className="text-white" />
        </IconButton>
      </div>

      {/* Sección del Logo */}
      <div className="sidebar-logo flex justify-center mb-8">
        <img
          src="/logo.png"
          alt={collapsed ? 'Logo colapsado' : 'Logo'}
          className={`transition-all duration-300 ${collapsed ? 'w-10 h-10' : 'w-12 h-12'}`}
        />
      </div>

      {/* Sección del Menú */}
      {!collapsed && <DividerWithText text="Menú" />}
      <div className="sidebar-menu flex-1 px-4 py-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`menu-link flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-x-4 py-3 px-4 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all relative ${pathname === item.path ? 'bg-[rgba(26,82,118,0.6)]' : ''}`}
          >
            {item.icon}
            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            {pathname === item.path && (
              <span 
                className={`absolute transition-all duration-300 ${collapsed ? 'right-1' : 'right-5'} w-2 h-2 bg-yellow-500 rounded-full animate-bounce`}
                style={{
                  boxShadow: '0 0 5px rgba(59, 130, 246, 0.7)',
                  animationDuration: '0.5s',
                  filter: collapsed ? 'brightness(1.5)' : 'brightness(1)',
                }}
              />
            )}
          </Link>
        ))}
      </div>

      {/* Sección del Usuario */}
      {!collapsed && <DividerWithText text="Usuario" />}
      <div className="sidebar-footer px-4 py-2">
        <div className={`user-info flex items-center ${collapsed ? "justify-center" : "justify-start"} gap-x-4 px-4 py-2`}>
          <Avatar
            alt="User"
            src={user?.avatarUrl || "https://via.placeholder.com/50"}
            className="w-12 h-12 transition-all duration-300"
          />
          {!collapsed && (
            <div>
              <p className="user-name text-sm font-medium">{user?.name || 'Invitado'}</p>
              <p className="user-role text-xs text-gray-400">Ingeniero de software</p>
            </div>
          )}
        </div>

        {/* Botón de logout */}
        <div className="mt-6 w-full">
          <button
            onClick={handleLogout}
            className="menu-link flex items-center space-x-4 py-4 px-4 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all"
          >
            <LogoutIcon className="mr-2" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
