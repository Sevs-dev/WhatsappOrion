'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Toast from '../toastr/toast';
import '../toastr/toast.css';
import Loader from '../loader/Loader';
import { register } from '../../services/authService/authService'; // IMPORTAR LA FUNCIÓN

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const router = useRouter();

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      showToast('failure', 'Por favor completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      showToast('failure', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      showToast('failure', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password }); // LLAMADA AL SERVICIO
      showToast('success', 'Registro exitoso. Ahora puedes iniciar sesión.');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      showToast('failure', error.message || 'Error al registrar usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
         style={{ backgroundImage: "url('/FondoLogin.jpg')" }}>
      {loading && <Loader />}
      <motion.div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg w-full max-w-md p-8 border border-white/20">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">Registro</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                 placeholder="Nombre completo" className="w-full p-3 border rounded-lg bg-white/10 text-white placeholder-white/70"/>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                 placeholder="Correo electrónico" className="w-full p-3 border rounded-lg bg-white/10 text-white placeholder-white/70"/>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                 placeholder="Contraseña" className="w-full p-3 border rounded-lg bg-white/10 text-white placeholder-white/70"/>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                 placeholder="Confirmar contraseña" className="w-full p-3 border rounded-lg bg-white/10 text-white placeholder-white/70"/>
          <button type="submit" className="w-full text-white py-3 rounded-lg hover:bg-opacity-80 hover:scale-105 transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-opacity-50 shadow-md hover:shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'rgba(26, 82, 118, 0.9)' }} disabled={password.length < 6}>
            Registrarse
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/login" className="text-white hover:underline">¿Ya tienes una cuenta? Inicia sesión</a>
        </div>
      </motion.div>
      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

export default Register;
