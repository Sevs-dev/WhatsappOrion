import React, { useState } from 'react';
import ModalCrearCliente from './ModalAgregarCliente';
import ListaClientes from './ListaClientes';

const GestorClienteView = () => {
  const [refresh, setRefresh] = useState(false);

  const handleRefreshClientes = () => setRefresh(prev => !prev);

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 items-center mb-4 bg-[#20415e] p-4 rounded shadow">
        <h1 className="text-2xl font-bold text-white">Listado de clientes</h1>
        <div className="flex justify-end">
          <button>
            <ModalCrearCliente onClientCreated={handleRefreshClientes} />
          </button>
        </div>
      </div>
      <ListaClientes refresh={refresh} />
    </div>
  );
};

export default GestorClienteView;
