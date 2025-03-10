import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

function Home() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-bl from-gray-900 via-gray-800 to-black flex items-center justify-center overflow-hidden rounded-lg">
      {/* Fondo con efectos de neón */}
      <div className="absolute inset-0">
        <div className="absolute w-72 h-72 bg-gradient-to-br from-green-400 to-teal-400 opacity-20 rounded-full blur-2xl -top-10 -left-10 animate-pulse" />
        <div className="absolute w-60 h-60 bg-gradient-to-tr from-blue-400 to-cyan-400 opacity-20 rounded-full blur-2xl bottom-5 right-5 animate-pulse" />
      </div>

      {/* Contenedor principal */}
      <motion.div
        className="relative bg-white bg-opacity-5 backdrop-blur-2xl px-6 py-8 rounded-2xl shadow-xl w-full max-w-3xl border border-gray-700 sm:px-10 sm:py-12 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        {/* Partículas dentro del contenedor principal */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Particles
            id="tsparticles-main"
            init={particlesInit}
            options={{
              background: { color: "transparent" },
              particles: {
                number: { value: 80 },
                size: { value: 2 },
                move: { enable: true, speed: 0.8 },
                opacity: { value: 0.7 },
                color: { value: "#3B82F6" }, // Partículas azules
              },
            }}
            className="w-full h-full"
          />
        </div>

        <div className="relative z-10 text-center">
          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            Bienvenido a <span className="text-blue-400">WhatsApp-Orion</span>
          </motion.h1>

          <motion.p
            className="text-sm sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4 }}
          >
            La solución empresarial para tu comunicación. Conéctate con clientes y equipos de manera eficiente y segura.
          </motion.p>

          <motion.div
            className="flex justify-center"
            initial={{ y: -10 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="bg-[#11ffff9a] p-4 sm:p-6 rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
              <img
                src="/orion.png"
                alt="WhatsApp Icon"
                className="w-28 h-28 sm:w-40 sm:h-40 object-contain"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;