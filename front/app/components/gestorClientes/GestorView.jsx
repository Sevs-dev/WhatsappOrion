import React from 'react';
import ModalCrearCliente from './ModalAgregarCliente';
import ListaClientes from './ListaClientes';

const GestorClienteView = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestor de Clientes</h1>
        <div className="buttons-container">
          <ModalCrearCliente />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <ListaClientes />
      </div>
    </div>
  );
};

export default GestorClienteView;