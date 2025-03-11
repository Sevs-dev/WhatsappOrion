import React, { useState, useEffect } from 'react';
import { Box, Modal } from '@mui/material';
import ClientApiService from '../../services/GestorCliente/ClientApiService';
import Toast from '../toastr/toast';
import debounce from 'lodash.debounce';
import Text from '../text/Text';
import Buttons from '../button/Button';
import '../toastr/toast.css';

const ModalCrearCliente = ({ onClientCreated }) => {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    estado: 1,
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await ClientApiService.getClients();
        setClients(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Función de búsqueda debounced (se usará en onBlur)
  const handleClientSearch = debounce((inputValue) => {
    if (!inputValue) {
      setFormData((prev) => ({
        ...prev,
        codigo: '',
        nombre: '',
      }));
      return;
    }

    // Se busca una coincidencia exacta en valor numérico y en la longitud del string
    const matchedClient = clients.find(client =>
      parseInt(client.codigo_cliente, 10) === parseInt(inputValue, 10) &&
      client.codigo_cliente.length === inputValue.length
    );

    if (matchedClient) {
      setFormData((prev) => ({
        ...prev,
        codigo: matchedClient.codigo_cliente,
        nombre: matchedClient.descripcion_cliente,
      }));
    }
  }, 500);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Solo actualizamos el input; la autocompletación se hará en onBlur
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await ClientApiService.createClient(formData);
      handleClose();
      setFormData({ codigo: '', nombre: '', estado: 1 });
      setToast({
        show: true,
        type: 'success',
        message: `El cliente "${formData.nombre}" se ha creado con éxito.`,
      });
      if (onClientCreated) onClientCreated();
    } catch (error) {
      console.error('Error creando cliente:', error);
      setToast({
        show: true,
        type: 'failure',
        message: 'Hubo un problema al crear el cliente. Intenta nuevamente.',
      });
    } finally {
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    }
  };

  return (
    <div>
      {toast.show && <Toast type={toast.type} message={toast.message} />}
      <Buttons onClick={handleOpen} variant="create" label="Crear Cliente" />
      <Modal open={open} onClose={handleClose}>
        <Box className="flex items-center justify-center min-h-screen p-4">
          <Box className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <Text type="title">Agregar Cliente</Text>
            <div className="space-y-4">
              {/* Código del Cliente */}
              <div>
                <Text type="subtitle">Código del Cliente</Text>
                <div>
                  <input
                    type="text"
                    className="border border-gray-300 p-2 rounded w-full"
                    placeholder="Escriba el código del cliente"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    onBlur={(e) => handleClientSearch(e.target.value)}
                    list="clientes-codigo"
                  />
                  <datalist id="clientes-codigo">
                    {clients.map(client => (
                      <option
                        key={client.codigo_cliente}
                        value={client.codigo_cliente}
                      >
                        {client.descripcion_cliente}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Nombre del Cliente */}
              <div>
                <Text type="subtitle">Nombre del Cliente</Text>
                <div>
                  <input
                    type="text"
                    className="border border-gray-300 p-2 rounded w-full"
                    placeholder="Nombre del cliente"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    list="clientes-nombre"
                  />
                  <datalist id="clientes-nombre">
                    {clients.map(client => (
                      <option
                        key={client.codigo_cliente}
                        value={client.descripcion_cliente}
                      />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Estado */}
              <div>
                <Text type="subtitle">Estado</Text>
                <div>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-center gap-2">
                <Buttons onClick={handleClose} variant="cancel" />
                <Buttons onClick={handleSave} variant="save" />
              </div>
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalCrearCliente;
