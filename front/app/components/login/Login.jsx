'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Toast from '../toastr/toast';
import '../toastr/toast.css';
import Loader from '../loader/Loader';
import { login } from '../../services/authService/authService';

function Login() {
  const [email, setEmail] = useState('admin@logismart.com.co');
  const [password, setPassword] = useState('Logismart25*');
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  const handleLogin = (email, isAdmin) => {
    localStorage.setItem("userEmail", email);
    localStorage.setItem("isAdmin", isAdmin);
    router.push("/dashboard/home");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      showToast('failure', 'Completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const response = await login(email, password);
      if (response.success) {
        const data = response.data;
        localStorage.setItem('token', data.autorización.token);
        localStorage.setItem('userName', data.usuario.name);
        const isAdmin = email === "admin@logismart.com.co";
        handleLogin(email, isAdmin);
      } else {
        setError(response.message || 'Error de inicio de sesión');
        showToast('failure', response.message || 'Error de inicio de sesión');
      }
    } catch (err) {
      showToast('failure', 'Error de conexión');
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: "url('/FondoLogin.jpg')" }}>
         
      {loading && <Loader />}
      
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row bg-white/20 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden 
                   w-full max-w-[90%] md:max-w-5xl border border-white/10 mx-auto"
        style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
      >
        {/* Formulario */}
        <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center">
          <div className="flex justify-center mb-4 md:mb-6">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-12 h-12 md:w-24 md:h-24 object-contain" 
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <h2 className="text-lg md:text-3xl font-bold text-center text-white mb-4 md:mb-6">
              Iniciar Sesión
            </h2>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs md:text-sm font-medium text-white/90">
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 md:py-3 border border-white/30 rounded-lg bg-white/5 
                           text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="ejemplo@dominio.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs md:text-sm font-medium text-white/90">
                CONTRASEÑA
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 md:py-3 border border-white/30 rounded-lg bg-white/5 
                           text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              style={{ backgroundColor: 'rgba(26, 82, 118, 0.9)' }}
              className="w-full text-white py-2 md:py-3 rounded-lg hover:bg-opacity-80 transition-all 
                         duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50 
                         shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
              Ingresar
            </button>

            <div className="mt-4 text-center">
              <span onClick={() => router.push('/register')} 
                    className="text-xs md:text-sm text-white/80 hover:text-white cursor-pointer 
                               hover:underline transition-all">
                ¿No tienes cuenta? Regístrate
              </span>
            </div>

            <div className="text-center">
              <a href="#" className="text-xs md:text-sm text-white/80 hover:text-white 
                                    transition-all duration-200">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </div>

        {/* Imagen derecha */}
        <div className="hidden md:block md:w-1/2 bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: "url('/PharexFondo.png')" }}>
        </div>
      </motion.div>

      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

export default Login;