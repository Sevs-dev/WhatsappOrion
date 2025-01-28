import React from 'react'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="bg-white p-12 rounded-3xl shadow-lg w-full max-w-4xl relative overflow-hidden">
        
        {/* Fondo sutil */}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-15 rounded-3xl z-0"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">
            Bienvenido a <span className="text-blue-600">WhatsApp-Orion</span>
          </h1>
          
          <p className="text-lg text-gray-600 text-center mb-8">
            La solución empresarial para tu comunicación. Conéctate con clientes y equipos de manera eficiente y segura.
          </p>

          <div className="flex justify-center mb-6">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png" 
              alt="WhatsApp Icon" 
              className="w-24 h-24 object-contain"
            />
          </div> 
        </div>
      </div>
    </div>
  )
}

export default Home
