import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { IconButton, Avatar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [openSubMenus, setOpenSubMenus] = useState({});

  const router = useRouter();
  const pathname = usePathname();
  const collapsed = (isCollapsed || autoCollapsed) && !isHovered;

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedUserData = localStorage.getItem('userData');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);

    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    } else if (storedUserName) {
      setUser({ name: storedUserName });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setAutoCollapsed(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const menuItems = useMemo(() => {
    const items = [
      { path: '/dashboard/home', icon: <HomeIcon className="text-white" />, label: 'Inicio' },
      { path: '/dashboard/gestorClientes', icon: <ListIcon className="text-white" />, label: 'Listado clientes' },
      { path: '/dashboard/gestorFlujos', icon: <TimelineIcon className="text-white" />, label: 'Gestor de flujos' },
      {
        label: 'Mensajes',
        icon: <EmailIcon className="text-white" />,
        children: [
          { path: '/dashboard/configDatos', icon: <EmailIcon className="text-white" />, label: 'Envío de Mensajes' },
          ...(isAdmin ? [{ path: '/dashboard/configuracion', icon: <SettingsIcon className="text-white" />, label: 'Configuración' }] : []),
        ],
      },
    ];
    return items;
  }, [isAdmin]);

  const toggleSubMenu = (index) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <nav 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!autoCollapsed) setIsHovered(false)
      }}
      className={`h-screen flex flex-col bg-gradient-to-b from-[#1A5276]/90 to-[#1A5276]/70 
                  backdrop-blur-xl border-r border-white/10 transition-all duration-300 
                  ${collapsed ? 'w-20' : 'w-72'}`}
      style={{
        boxShadow: 'inset -10px 0 20px -10px rgba(0,0,0,0.2)',
        backgroundImage: 'radial-gradient(circle at 5% 5%, rgba(255,255,255,0.03) 0%, transparent 10%)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-1 transition-transform duration-300 hover:scale-105">
          {!collapsed && <img src="/logo.png" alt="Logo" className="w-8 h-8" />}
          <span className={`text-white font-bold text-lg ${collapsed && 'hidden'}`}>
            LogiSmart
          </span>
        </div>
        <IconButton 
          onClick={toggleSidebar} 
          className="hover:bg-[#1A5276]/50 rounded-full transition-all 
                     hover:scale-105 hover:shadow-lg"
        >
          <MenuIcon className="text-white mr-2" />
        </IconButton>
      </div>

      <div className="sidebar-logo flex justify-center mb-8">
        <img src="/PHAREX-01.png" alt="Logo" className={`transition-all duration-300 ${collapsed ? 'w-15 h-5' : 'w-40 h-15'}`} />
      </div>

      {!collapsed && <div className="flex items-center px-4"><div className="flex-grow border-t border-gray-400"></div><span className="mx-2 text-xs text-gray-400">Menú</span><div className="flex-grow border-t border-gray-400"></div></div>}
      <div className="sidebar-menu flex-1 px-4 py-2">
        {menuItems.map((item, index) =>
          item.children ? (
            <div key={index}>
              <div
                onClick={() => toggleSubMenu(index)}
                className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-x-4 py-3 px-4 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all cursor-pointer`}
              >
                {item.icon}
                {!collapsed && (
                  <>
                    <span className="whitespace-nowrap">{item.label}</span>
                    <span className="ml-auto transition-transform duration-300 transform">
                      <motion.span
                        animate={{ rotate: openSubMenus[index] ? 180 : 0 }}
                      >
                        ▼
                      </motion.span>
                    </span>
                  </>
                )}
              </div>
              <AnimatePresence>
                {openSubMenus[index] && !collapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="ml-8 overflow-hidden"
                  >
                    {item.children.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.path}
                        className={`flex items-center gap-x-4 py-3 px-4 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all ${pathname === subItem.path ? 'bg-[rgba(26,82,118,0.6)]' : ''}`}
                      >
                        {subItem.icon}
                        <span className="whitespace-nowrap">{subItem.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              key={index}
              href={item.path}
              className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-x-4 py-3 px-4 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all ${pathname === item.path ? 'bg-[rgba(26,82,118,0.6)]' : ''}`}
            >
              {item.icon}
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          )
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar 
            src={user?.avatarUrl || "https://via.placeholder.com/40"} 
            className="w-10 h-10 border-2 border-white/30 transition-all 
                       hover:scale-105 hover:border-white/60"
          />
          {!collapsed && (
            <div>
              <p className="text-white text-sm font-medium">{user?.name || 'Invitado'}</p>
              <p className="text-xs text-white/60">Ingeniero de Software</p>
            </div>
          )}
        </div>
        
        <Tooltip title="Cerrar sesión" placement="top" arrow>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all bg-gradient-to-r from-red-500 to-red-700 hover:text-white"
          >
            <Logout className="text-white" />
            <span className={`${collapsed ? 'hidden' : 'block'}`}>Cerrar sesión</span>
          </button>
        </Tooltip>
      </div>
    </nav>
  );
};

export default Sidebar;