import React from 'react';

function Home() {
  return (
<div className="relative min-h-screen bg-gradient-to-bl from-gray-900 via-gray-800 to-black flex items-center justify-center overflow-hidden rounded-lg">
  {/* Efectos decorativos en el fondo */}
  <div className="absolute inset-0">
    {/* Gradiente verdoso oscuro */}
    <div className="absolute w-72 h-72 bg-gradient-to-br from-green-900 to-teal-800 opacity-30 rounded-full blur-2xl -top-10 -left-10"></div>
    {/* Gradiente azul oscuro */}
    <div className="absolute w-60 h-60 bg-gradient-to-tr from-blue-900 to-cyan-800 opacity-20 rounded-full blur-2xl bottom-5 right-5"></div>
  </div>

      {/* Contenedor principal */}
      <div className="relative bg-white bg-opacity-90 backdrop-blur-2xl px-6 py-8 rounded-2xl shadow-xl w-full max-w-3xl border border-gray-200 sm:px-10 sm:py-12">
        
        {/* Fondo decorativo interno */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-10 rounded-2xl blur-md z-0"></div>

        <div className="relative z-10">
          {/* Título */}
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
            Bienvenido a <span className="text-blue-600">WhatsApp-Orion</span>
          </h1>
          
          {/* Descripción */}
          <p className="text-sm sm:text-lg text-gray-600 text-center mb-6 sm:mb-8 leading-relaxed">
            La solución empresarial para tu comunicación. Conéctate con clientes y equipos de manera eficiente y segura.
          </p>

          {/* Icono */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="bg-gradient-to-tr from-blue-500 to-indigo-500 p-4 sm:p-6 rounded-full shadow-lg">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png" 
                alt="WhatsApp Icon" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
              />
            </div>
          </div> 
        </div>
      </div>
    </div>
  );
}

export default Home;
