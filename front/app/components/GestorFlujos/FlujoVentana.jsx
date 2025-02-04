import React, { useState, useEffect } from "react";
import GestorFlujosServ from '../../services/GestorFlujos/GestorFlujosServ';

const FlujoVentana = ({ id }) => {
  // Estados para almacenar datos del mensaje, cliente, mensajes, error, etc.
  const [message, setMessage] = useState(null);
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [dataId, setDataId] = useState();
  const [error, setError] = useState(null);
  const [estado, setEstado] = useState({});
  const [clientId, setClientId] = useState(null);
  const [messageId, setMessageID] = useState(null);
  const [selectedEstados, setSelectedEstados] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lista de todos los estados posibles
  const estados = [
    'Inicio',
    'Recibido',
    'En procesamiento',
    'En alistamiento',
    'Alistado',
    'Verificado',
    'En transporte',
    'En transito',
    'Entregado',
    'Con novedad',
    'Final'
  ];

  // Primer useEffect para obtener el mensaje y el cliente usando el id
  useEffect(() => {
    const fetchMessageAndClient = async () => {
      try {
        // Primero, obtenemos el mensaje (puede ser un mensaje o el primer mensaje relacionado)
        const messageData = await GestorFlujosServ.getMessageById(id);
        setMessage(messageData);
        setDataId(messageData?.data?.id_cliente_whatsapp); 
        const codigo = messageData?.data?.codigo;
        setMessageID(messageData?.data?.id_cliente_whatsapp);
        if (codigo) {
          // Buscamos el cliente a partir del código
          const clientData = await GestorFlujosServ.getClientByCodigo(codigo);
          setClient(clientData);
          setClientId(clientData?.id);
          // Llamamos a la función para obtener los estados del cliente
          fetchClientStates(clientData?.id);
        } else {
          setError('Código no encontrado en el mensaje.');
        }
      } catch (err) {
        setError('No se pudo obtener los datos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessageAndClient();
  }, [id]);

  // Segundo useEffect para obtener los estados del cliente una vez tenemos su ID
  useEffect(() => {
    if (!clientId) return;
    const fetchData = async () => {
      try {
        const response = await GestorFlujosServ.getClientStates(clientId);
        console.log("Respuesta del servidor con los estados:", response.data);

        const estadosArray = JSON.parse(response.data.estados);
        setSelectedEstados(estadosArray);
        setEstado(estadosArray.reduce((acc, curr) => ({ ...acc, [curr]: true }), {}));
      } catch (err) {
        console.error("Error obteniendo los estados del cliente:", err);
        setError("Error al obtener los estados del cliente.");
      }
    };

    fetchData();
  }, [clientId]);

  // UseEffect para obtener los mensajes asociados al cliente usando su ID (usando el microservicio)
  useEffect(() => {
    if (!dataId) return;
    const fetchMessages = async () => {
      try {
        const response = await GestorFlujosServ.getMessagesByClientId(dataId);
        console.log("Respuesta del servidor con los mensajes:", response);
        console.log("Mensajes del cliente:", response.data);
        setMessages(response.data);
      } catch (err) {
        console.error("Error obteniendo los mensajes del cliente:", err);
        setError("Error al obtener los mensajes del cliente.");
      }
    };

    fetchMessages();
  }, [dataId]);

  // Función para obtener los estados del cliente (si se requiere llamar en otro momento)
  const fetchClientStates = async (clientId) => {
    setLoading(true);
    try {
      const response = await GestorFlujosServ.getClientStates(clientId);
      const estados = response.estados;
      setSelectedEstados(estados);
      console.log("Respuesta del servidor con los estados parseados:", response);
      setEstado(estados.reduce((acc, curr) => ({ ...acc, [curr]: true }), {}));
    } catch (err) {
      console.error("Error obteniendo los estados del cliente:", err);
      setError("Error al obtener los estados del cliente.");
    } finally {
      setLoading(false);
    }
  };

  // Maneja el cambio en los checkbox de los estados
  const handleEstadoChange = (event) => {
    const { name, checked } = event.target;

    setSelectedEstados((prev) => {
      if (checked && !prev.includes(name)) {
        return [...prev, name];
      } else if (!checked && prev.includes(name)) {
        return prev.filter((estado) => estado !== name);
      }
      return prev;
    });

    setEstado((prevEstado) => ({
      ...prevEstado,
      [name]: checked
    }));
  };

  // Función para guardar el estado del flujo
  const handleSave = async () => {
    if (!clientId) {
      setError("No se puede guardar sin un ID de cliente.");
      return;
    }
    if (selectedEstados.length === 0) {
      setError("Debe seleccionar al menos un estado.");
      return;
    }

    const data = {
      id_api: clientId,
      estados: JSON.stringify(selectedEstados),
      message: messageId,
    };
    console.log("Datos a enviar al servidor:", data);

    try {
      const response = await GestorFlujosServ.saveEstadoFlujo(data);
      console.log("Estado guardado con éxito:", response);
      alert("Estado guardado correctamente.");
    } catch (error) {
      console.error("Error guardando el estado del flujo:", error);
      setError("Error al guardar el estado.");
    }
  };

  const { nombre, codigo } = client || {};

  if (loading) {
    return <div className="text-white">Cargando datos...</div>;
  }

  return (
    <div className="flex bg-gray-800 p-6 rounded-lg shadow-lg text-white max-w-full mx-auto">
      <div className="w-1/2 pr-4">
        <h1 className="text-xl font-bold mb-2">Gestor de Flujos</h1>

        {client ? (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Cliente Encontrado</h2>
            <p><strong>Código:</strong> {codigo}</p>
            <p><strong>Nombre Cliente:</strong> {nombre}</p>
          </div>
        ) : (
          <p className="text-yellow-500 mt-2">No se encontró un cliente con este código.</p>
        )}

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Estado del Flujo</h3>
          <div className="space-y-2">
            {estados.map((estadoOption) => (
              <div key={estadoOption} className="flex items-center">
                <input
                  type="checkbox"
                  id={estadoOption}
                  name={estadoOption}
                  checked={estado[estadoOption] || false}
                  onChange={handleEstadoChange}
                  className="mr-2"
                />
                <label htmlFor={estadoOption} className="text-white">{estadoOption}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <button
            className="bg-blue-600 p-2 text-white rounded"
            onClick={handleSave}
          >
            Guardar Estado
          </button>
        </div>
      </div>

      <div className="w-1/2 pl-4">
        <h3 className="text-lg font-semibold mb-2">Estados Seleccionados</h3>
        {selectedEstados.length > 0 ? (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-2 text-left text-white">Estado</th>
              </tr>
            </thead>
            <tbody>
              {selectedEstados.map((estadoSeleccionado, index) => (
                <tr key={index} className="bg-gray-800">
                  <td className="px-4 py-2 text-white">{estadoSeleccionado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-yellow-500">No se han seleccionado estados.</p>
        )}

        {/* Sección para mostrar la lista de mensajes asociados al cliente */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Mensajes del Cliente</h3>
          {messages.length > 0 ? (
            <ul className="list-disc pl-5">
              {messages.map((msg) => (
                <li key={msg.id}>
                  <p><strong>{msg.titulo}</strong></p>
                  <p>{msg.descripcion}</p>
                  <p className="text-sm">Fecha: {msg.fecha}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-yellow-500">No hay mensajes para este cliente.</p>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FlujoVentana;
