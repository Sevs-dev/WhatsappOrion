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
import SettingsIcon from '@mui/icons-material/Settings';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [autoCollapsed, setAutoCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const collapsed = isCollapsed || autoCollapsed;

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedUserData = localStorage.getItem('userData');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    // console.log("Is Admin:", adminStatus); // Depuración
    setIsAdmin(adminStatus);
  
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    } else if (storedUserName) {
      setUser({ name: storedUserName });
    }
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setAutoCollapsed(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAdmin');
    setUser(null);
    router.push('/login');
  };

  const menuItems = useMemo(() => {
    const items = [
      { path: '/dashboard/home', icon: <HomeIcon className="text-white" />, label: 'Inicio' },
      { path: '/dashboard/gestorClientes', icon: <ListIcon className="text-white" />, label: 'Listado clientes' },
      { path: '/dashboard/gestorFlujos', icon: <TimelineIcon className="text-white" />, label: 'Gestor de flujos' },
      { path: '/dashboard/configDatos', icon: <EmailIcon className="text-white" />, label: 'Envío de Mensajes' },
    ];
    if (isAdmin) {
      items.push({ path: '/dashboard/configuracion', icon: <SettingsIcon className="text-white" />, label: 'Configuración' });
    }
    return items;
  }, [isAdmin]);

  return (
    <div className={`flex flex-col h-screen bg-gray-800/40 backdrop-blur-md shadow-lg rounded-r-xl text-white transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex justify-end p-4">
        <IconButton onClick={toggleSidebar} className="hover:bg-[rgba(26,82,118,0.9)] rounded-full">
          <MenuIcon className="text-white" />
        </IconButton>
      </div>

      <div className="sidebar-logo flex justify-center mb-8">
        <img src="/logo.png" alt="Logo" className={`transition-all duration-300 ${collapsed ? 'w-10 h-10' : 'w-12 h-12'}`} />
      </div>

      {!collapsed && <div className="flex items-center px-4"><div className="flex-grow border-t border-gray-400"></div><span className="mx-2 text-xs text-gray-400">Menú</span><div className="flex-grow border-t border-gray-400"></div></div>}
      <div className="sidebar-menu flex-1 px-4 py-2">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path} className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-x-4 py-3 px-4 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all ${pathname === item.path ? 'bg-[rgba(26,82,118,0.6)]' : ''}`}>
            {item.icon}
            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
          </Link>
        ))}
      </div>

      {!collapsed && <div className="flex items-center px-4"><div className="flex-grow border-t border-gray-400"></div><span className="mx-2 text-xs text-gray-400">Usuario</span><div className="flex-grow border-t border-gray-400"></div></div>}
      <div className="sidebar-footer px-4 py-2">
        <div className={`user-info flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-x-4 px-4 py-2`}>
          <Avatar alt="User" src={user?.avatarUrl || "https://via.placeholder.com/50"} className="w-12 h-12" />
          {!collapsed && (
            <div>
              <p className="text-sm font-medium">{user?.name || 'Invitado'}</p>
              <p className="text-xs text-gray-400">Ingeniero de software</p>
            </div>
          )}
        </div>

        <div className="mt-6 w-full">
          <button onClick={handleLogout} className="flex items-center py-4 px-4 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all">
            <LogoutIcon className="mr-2" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
