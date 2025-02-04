import React, { useState } from 'react';
import ModalCrearCliente from './ModalAgregarCliente';
import ListaClientes from './ListaClientes';

const GestorClienteView = () => {
  const [refresh, setRefresh] = useState(false); // Estado para controlar la actualización

  // Función que actualiza la lista de clientes
  const handleRefreshClientes = () => {
    setRefresh(prev => !prev); // Cambiar el estado de refresh para disparar el re-fetch en ListaClientes
  };

  return (
    <div>
      <div className='header'>
        <h1>Listado de clientes</h1>
        <div className='buttons-container'>
          <ModalCrearCliente onClientCreated={handleRefreshClientes} /> {/* Pasa la función como prop */}
        </div>
      </div>
      <div className='content'>
        <ListaClientes refresh={refresh} /> {/* Pasa el estado de refresh */}
      </div>
    </div>
  );
};

export default GestorClienteView;
