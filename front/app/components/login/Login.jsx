'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Toast from '../toastr/toast';
import '../toastr/toast.css';
import Loader from '../loader/Loader';
import { login } from '../../services/authService/authService'; // Asegúrate de importar la función login

function Login() {
  const [email, setEmail] = useState('admin@logismart.com.co');
  const [password, setPassword] = useState('Logismart25*');
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    type: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 3000);
  };
  const handleLogin = (email, isAdmin) => {
    localStorage.setItem("userEmail", email); // Almacena el correo electrónico
    localStorage.setItem("isAdmin", isAdmin); // Almacena el estado de administrador
    router.push("/dashboard/home"); // Redirige al usuario a la página de inicio
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
        showToast('failure', 'Por favor completa todos los campos');
        setLoading(false);
        return;
    }

    try {
        const response = await login(email, password); // Usa la función del authService

        if (response.success) {
            const data = response.data;
            localStorage.setItem('token', data.autorización.token);
            localStorage.setItem('userName', data.usuario.name);

            // Verificar si el usuario es admin
            const isAdmin = email === "admin@logismart.com.co";
            handleLogin(email, isAdmin);
        } else {
            setError(response.message || 'Error de inicio de sesión.');
            showToast('failure', response.message || 'Error de inicio de sesión.');
        }
    } catch (err) {
        showToast('failure', 'Error al conectar con el servidor.');
        setError('Error al conectar con el servidor');
    } finally {
        setLoading(false);
    }
};

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/FondoLogin.jpg')" }}
    >
      {loading && <Loader />}

      {/* Contenedor principal con dos columnas */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row bg-white/20 backdrop-blur-md rounded-lg shadow-lg overflow-hidden w-full max-w-4xl border border-white/20 mx-4"
      >
        {/* Columna izquierda: Formulario de inicio de sesión */}
        <div className="w-full md:w-1/2 p-4 md:p-8">
          {/* Logo en la parte superior */}
          <div className="flex justify-center mb-4 md:mb-6">
            <img
              src="/logo.png" // Ruta de la imagen del logo
              alt="Logo de la empresa"
              className="w-16 h-16 md:w-24 md:h-24" // Ajusta el tamaño del logo
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-white mb-4 md:mb-6">Iniciar Sesión</h2>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1 md:mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 md:p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Ingresa tu correo"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1 md:mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 md:p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            <button
              type="submit"
              style={{ backgroundColor: 'rgba(26, 82, 118, 0.9)' }} // Color del botón
              className="w-full text-white py-2 md:py-3 rounded-lg hover:bg-opacity-80 hover:scale-105 transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-opacity-50 shadow-md hover:shadow-lg"
            >
              Iniciar Sesión
            </button>
           
            <div className="mt-4 md:mt-6 text-center">
            <span onClick={() => router.push('/register')} className="text-white hover:underline cursor-pointer">
                 ¿No tienes una cuenta? Regístrate aquí
                 </span>

            </div>

            <div className="mt-4 md:mt-6 text-center">
              <a
                href="#"
                style={{ color: 'white' }} // Color del enlace
                className="text-sm hover:opacity-80 hover:underline transition-all"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </div>

        {/* Columna derecha: Imagen referente al programa */}
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/PharexFondo.png')" }}>
          {/* Puedes agregar texto o elementos adicionales aquí si lo deseas */}
        </div>
      </motion.div>

      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

export default Login;