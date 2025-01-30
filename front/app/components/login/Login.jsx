'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion'; // Importa motion
import Toast from '../toastr/toast';
import '../toastr/toast.css';
import Loader from '../loader/Loader';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset the error state before making the request
    setLoading(true);

    if (!email || !password) {
      showToast('failure', 'Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.autorización.token);
        localStorage.setItem('userName', data.usuario.name); 
        showToast('success', 'Inicio de sesión correcto.');
        router.push('/dashboard/home');
      } else {
        setError(data.message || 'Error de inicio de sesión.');
        showToast('failure', data.message || 'Error de inicio de sesión.');
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
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/PharexFondo.png')" }}
    >
      {loading && <Loader />}

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl shadow-2xl border border-[#3f3f3f] border-opacity-20 p-8 w-full max-w-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-black mb-6">Iniciar Sesión</h2>

          {error && (
            <p className="text-red-500 text-center bg-red-50 bg-opacity-80 p-2 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-[#3f3f3f] border-opacity-30 rounded-lg bg-white bg-opacity-20 text-[#363636] placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all"
              placeholder="Ingresa tu correo"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-[#3f3f3f] border-opacity-30 rounded-lg bg-white bg-opacity-20 text-[#363636] placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white bg-opacity-20 border-[#000000] text-black py-3 rounded-lg hover:bg-opacity-30 hover:scale-105 transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-[#a8c5e6] focus:ring-opacity-50 shadow-md hover:shadow-lg"
          >
            Iniciar Sesión
          </button>

          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm text-black hover:text-opacity-80 transition-all"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </motion.div>

      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

export default Login;
