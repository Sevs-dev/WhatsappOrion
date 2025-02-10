import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { IconButton, Avatar } from '@mui/material';

// Importación de iconos desde Material UI
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import TimelineIcon from '@mui/icons-material/Timeline';
import ListIcon from '@mui/icons-material/List';
import LogoutIcon from '@mui/icons-material/Logout';

// Componente Sidebar que recibe dos props: 
// isCollapsed (para determinar si se colapsa manualmente) 
// y toggleSidebar (para cambiar ese estado)
const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  // Estado para almacenar los datos del usuario
  const [user, setUser] = useState(null);
  // Estado para controlar si se debe colapsar automáticamente según el ancho de la ventana
  const [autoCollapsed, setAutoCollapsed] = useState(false);

  // Hooks de navegación y para obtener la ruta actual en Next.js
  const router = useRouter();
  const pathname = usePathname();

  // Combinamos el estado manual (isCollapsed) y el auto-colapso en una única variable
  const collapsed = isCollapsed || autoCollapsed;

  // useEffect para cargar los datos del usuario desde localStorage cuando el componente se monta
  useEffect(() => {
    // Se intenta obtener el nombre del usuario
    const storedUserName = localStorage.getItem('userName');
    // Se intenta obtener datos más completos del usuario en formato JSON
    const storedUserData = localStorage.getItem('userData');

    // Si existen datos completos del usuario, se parsean y se guardan en el estado
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    } else if (storedUserName) {
      // Si solo se tiene el nombre, se crea un objeto con esa información
      setUser({ name: storedUserName });
    }
  }, []); // Se ejecuta solo una vez al montar el componente

  // useEffect para manejar el auto-colapso en función del tamaño de la ventana
  useEffect(() => {
    // Función que actualiza el estado autoCollapsed según el ancho de la ventana
    const handleResize = () => {
      // Si el ancho es menor a 768px, se activa el colapso automático
      setAutoCollapsed(window.innerWidth < 768);
    };

    // Se añade el listener para el evento resize
    window.addEventListener('resize', handleResize);
    // Se llama la función al montar para establecer el estado inicial
    handleResize();

    // Se limpia el listener al desmontar el componente
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para cerrar la sesión del usuario
  const handleLogout = () => {
    // Se eliminan los datos de usuario y token del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userData');
    // Se actualiza el estado del usuario
    setUser(null);
    // Se redirige al usuario a la página de login
    router.push('/login');
  };

  // useMemo para memorizar la lista de elementos del menú y evitar que se vuelva a crear en cada render
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
  ], []); // Dependencias vacías: la lista no cambia durante el ciclo de vida del componente

  // Componente auxiliar para renderizar un divisor con texto en el centro
  const DividerWithText = ({ text }) => (
    <div className="flex items-center px-4 ">
      {/* Línea a la izquierda */}
      <div className="flex-grow border-t border-gray-400"></div>
      {/* Texto central */}
      <span className="mx-2 text-xs text-gray-400">{text}</span>
      {/* Línea a la derecha */}
      <div className="flex-grow border-t border-gray-400"></div>
    </div>
  );

  return (
    <div
      className={`flex flex-col h-screen bg-gray-800/40 backdrop-blur-md shadow-lg rounded-r-xl text-white transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Encabezado del Sidebar con el botón para colapsarlo */}
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
      {/* Se muestra el divisor con texto "Menú" solo si el sidebar no está colapsado */}
      {!collapsed && <DividerWithText text="Menú" />}
      <div className="sidebar-menu flex-1 px-4 py-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            // Se ajusta la clase dependiendo de si el sidebar está colapsado
            className={`menu-link flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-x-4 py-3 px-4 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all relative ${pathname === item.path ? 'bg-[rgba(26,82,118,0.6)]' : ''}`}
          >
            {/* Icono del item */}
            {item.icon}
            {/* Se muestra la etiqueta solo si el sidebar no está colapsado */}
            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            {/* Indicador visual para la ruta activa */}
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
      {/* Se muestra el divisor con texto "Usuario" solo si el sidebar no está colapsado */}
      {!collapsed && <DividerWithText text="Usuario" />}
      <div className="sidebar-footer px-4 py-2">
        <div className={`user-info flex items-center ${collapsed ? "justify-center" : "justify-start"} gap-x-4 px-4 py-2`}>
          {/* Avatar del usuario */}
          <Avatar
            alt="User"
            src={user?.avatarUrl || "https://via.placeholder.com/50"}
            className="w-12 h-12 transition-all duration-300"
          />
          {/* Información del usuario (nombre y rol) solo si el sidebar no está colapsado */}
          {!collapsed && (
            <div>
              <p className="user-name text-sm font-medium">{user?.name || 'Invitado'}</p>
              <p className="user-role text-xs text-gray-400">Ingeniero de software</p>
            </div>
          )}
        </div>

        {/* Botón para cerrar sesión */}
        <div className="mt-6 w-full">
          <button
            onClick={handleLogout}
            className="menu-link flex items-center space-x-4 py-4 px-4 w-full hover:bg-[rgba(26,82,118,0.9)] rounded-lg transition-all"
          >
            <LogoutIcon className="mr-2" />
            {/* Texto "Cerrar sesión" solo se muestra cuando no está colapsado */}
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
