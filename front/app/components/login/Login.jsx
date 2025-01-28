'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa useRouter
import Toast from '../toastr/toast';
import '../toastr/toast.css';

function Login() {
  const [email, setEmail] = useState('admin@logismart.com.co');
  const [password, setPassword] = useState('Logismart25*');
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    type: '',
    message: '',
  });

  const router = useRouter(); // Usa useRouter para redirigir

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    // Ocultar el toast después de 3 segundos
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

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
        // Guarda el token en localStorage
        localStorage.setItem('token', data.autorización.token);

        // Muestra un toast de éxito
        showToast('success', 'Inicio de sesión correcto.');

        // Redirige al usuario a la ruta /dashboard
        router.push('/dashboard/gestorClientes');
      } else {
        // Muestra un toast de error
        showToast('failure', 'Error de inicio de sesión.');
      }
    } catch (err) {
      // Muestra un toast de error
      showToast('failure', 'Error al conectar con el servidor.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/PharexFondo.png')" }}
    >
      {/* Contenedor estilo cristal */}
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl shadow-2xl border border-white border-opacity-20 p-8 w-full max-w-sm">
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
              className="w-full p-3 border border-white border-opacity-30 rounded-lg bg-white bg-opacity-20 text-[#363636] placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all"
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
              className="w-full p-3 border border-white border-opacity-30 rounded-lg bg-white bg-opacity-20 text-[#363636] placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white bg-opacity-20 text-black py-3 rounded-lg hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            Iniciar Sesión
          </button>

          {/* Enlace de "Olvidé mi contraseña" (opcional) */}
          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm text-black hover:text-opacity-80 transition-all"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </div>

      {/* Toast */}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
        />
      )}
    </div>
  );
}

export default Login;