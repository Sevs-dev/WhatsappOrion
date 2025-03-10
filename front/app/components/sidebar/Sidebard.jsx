import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { IconButton, Avatar, Tooltip } from '@mui/material';
import { 
  Menu as MenuIcon, 
  Home, 
  Email, 
  Timeline, 
  List, 
  Logout, 
  Settings,
  ExpandMore
} from '@mui/icons-material';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [autoCollapsed, setAutoCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
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

  // Elementos principales del menú (sin Mensajes y Configuración)
  const menuItems = useMemo(() => [
    { path: '/dashboard/home', icon: Home, label: 'Inicio' },
    { path: '/dashboard/gestorClientes', icon: List, label: 'Clientes' },
    { path: '/dashboard/gestorFlujos', icon: Timeline, label: 'Flujos' }
  ], []);

  // Submenú para Mensajes y Configuración
  const submenuItems = useMemo(() => [
    { path: '/dashboard/configDatos', icon: Email, label: 'Mensajes' },
    ...(isAdmin ? [{ path: '/dashboard/configuracion', icon: Settings, label: 'Configuración' }] : [])
  ], [isAdmin]);

  return (
    <nav 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!autoCollapsed) setIsHovered(false);
        setSubmenuOpen(false);
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
          {!collapsed && <img src="/PHAREX-01.png" alt="Logo" className="w-auto h-8" />} 
        </div>
        <IconButton 
          onClick={toggleSidebar} 
          className="hover:bg-[#1A5276]/50 rounded-full transition-all 
                     hover:scale-105 hover:shadow-lg"
        >
          <MenuIcon className="text-white mr-2" />
        </IconButton>
      </div>

      {/* Menu Principal */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {menuItems.map((item) => (
          <Tooltip 
            key={item.path} 
            title={item.label} 
            placement="right" 
            arrow 
            disableHoverListener={!collapsed}
            classes={{ tooltip: 'bg-[#1A5276] text-white' }}
          >
            <Link href={item.path} 
                 className={`flex items-center gap-4 p-3 mx-3 my-2 rounded-lg transition-all 
                            ${pathname === item.path 
                              ? 'bg-white/10 backdrop-blur-md shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]' 
                              : 'hover:bg-white/5 hover:scale-[1.01] hover:shadow-md'}`}
            >
              <item.icon className="text-white" />
              <span className={`text-white ${collapsed ? 'hidden' : 'flex'}`}>
                {item.label}
              </span>
              {!collapsed && pathname === item.path && (
                <div className="ml-auto w-1 h-6 bg-white/70 rounded-full transition-all duration-500" />
              )}
            </Link>
          </Tooltip>
        ))}

        {/* Submenú para "Mensajes" y "Configuración" */}
        <div 
          className="mx-3 my-2"
          onMouseEnter={() => setSubmenuOpen(true)}
          onMouseLeave={() => setSubmenuOpen(false)}
        >
          <div className={`flex items-center gap-4 p-3 rounded-lg transition-all cursor-pointer 
                           hover:bg-white/5 hover:scale-[1.01] hover:shadow-md`}>
            <Settings className="text-white" />
            <span className={`text-white ${collapsed ? 'hidden' : 'flex'}`}>Más opciones</span>
            {!collapsed && (
              <ExpandMore className={`text-white transition-transform duration-300 ${submenuOpen ? 'rotate-180' : ''}`} />
            )}
          </div>
          {/* Contenedor del submenú que se muestra debajo */}
          <div className={`transition-all duration-300 overflow-hidden ${submenuOpen ? 'max-h-40' : 'max-h-0'}`}>
            {submenuItems.map((item) => (
              <Link key={item.path} href={item.path} 
                className={`flex items-center gap-4 p-3 rounded-lg transition-all 
                            hover:bg-white/5 hover:scale-[1.01] hover:shadow-md whitespace-nowrap`}
              >
                <item.icon className="text-white" />
                <span className="text-white">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
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
