import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import GestorFlujosServ from "../../services/GestorFlujos/GestorFlujosServ";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Toast from '../toastr/toast';
import '../toastr/toast.css';

const FlujoVentana = ({ id }) => {
  const estados = [
    "Inicio", "Recibido", "En procesamiento", "Alistado", "Despachado", "Entregado", "Con novedad"
  ];

  const [client, setClient] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [selectedEstados, setSelectedEstados] = useState(new Set());
  const [estado, setEstado] = useState({});
  const [messageId, setMessageId] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estadoMessages, setEstadoMessages] = useState({});
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    const fetchDataClient = async () => {
      try {
        setLoading(true);
        const datosCliente = await GestorFlujosServ.getClientById(id);
        if (datosCliente?.data) {
          setClient(datosCliente.data);
          setClientId(datosCliente.data.id);
        } else {
          setClient(datosCliente);
          setClientId(datosCliente.id);
        }
      } catch (err) {
        setError("Error al obtener datos del cliente");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDataClient();
  }, [id]);

  useEffect(() => {
    if (!clientId) return;
    fetchEstados(clientId);
  }, [clientId]);

  const fetchEstados = async (id) => {
    try {
      const response = await GestorFlujosServ.getClientStates(id);
      if (!response || !response.estados) {
        console.warn("No hay estados disponibles para este cliente.");
        setSelectedEstados(new Set());
        setEstado({});
        return;
      }

      let estadosArray = response.estados;
      if (typeof estadosArray === "string") {
        try {
          estadosArray = JSON.parse(estadosArray);
        } catch (parseError) {
          console.error("Error al parsear los estados:", parseError);
          estadosArray = [];
        }
      }
      if (!Array.isArray(estadosArray)) estadosArray = [];

      setSelectedEstados(new Set(estadosArray));
      setEstado(estadosArray.reduce((acc, curr) => ({ ...acc, [curr]: true }), {}));
    } catch (err) {
      console.error("Error obteniendo estados:", err);
      setError("Error al obtener estados del cliente.");
    }
  };

  const fetchMessages = async (id) => {
    try {
      const response = await GestorFlujosServ.getMessageById(id);
      setMessageId(response.data[0]?.id_cliente_whatsapp);
    } catch (err) {
      console.error("Error obteniendo mensajes:", err);
      setError("Error al obtener mensajes del cliente.");
    }
  };

  useEffect(() => {
    if (!clientId) return;
    fetchMessages(clientId);
  }, [clientId]);

  const handleEstadoChange = (event) => {
    const { name, checked } = event.target;
    setSelectedEstados((prev) => {
      const newSet = new Set(prev);
      checked ? newSet.add(name) : newSet.delete(name);
      return newSet;
    });
    setEstado((prevEstado) => ({
      ...prevEstado,
      [name]: checked,
    }));
  };

  const handleSave = async () => {
    if (!clientId) {
      setToast({
        show: true,
        type: 'failure',
        message: 'No se puede guardar sin un ID de cliente.',
      });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000); // Ocultar después de 3 segundos
      return;
    }
    if (selectedEstados.size === 0) {
      setToast({
        show: true,
        type: 'failure',
        message: 'Debe seleccionar al menos un estado.',
      });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000); // Ocultar después de 3 segundos

      return;
    }

    const data = {
      id_api: clientId,
      estados: JSON.stringify([...selectedEstados]),
      message: messageId,
      codigo: client.codigo
    };

    try {
      await GestorFlujosServ.saveEstadoFlujo(data);
      setToast({
        show: true,
        type: 'success',
        message: 'Estado guardado correctamente.',
      });
    } catch (error) {
      console.error("Error guardando el estado del flujo:", error);
      setToast({
        show: true,
        type: 'failure',
        message: 'Error al guardar el estado.',
      });
    } finally {
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    }
  };

  useEffect(() => {
    if (!messageId) return;
    const fetchMessages = async () => {
      try {
        const response = await GestorFlujosServ.getMessagesByClientId(messageId);
        setMessages(response.data);
      } catch (err) {
        console.error("Error obteniendo los mensajes del cliente:", err);
        setError("Error al obtener los mensajes del cliente.");
      }
    };

    fetchMessages();
  }, [messageId]);

  const MessageItem = ({ message }) => {
    const [, drag] = useDrag(() => ({
      type: "MESSAGE",
      item: { message },
    }));

    return (
      <li ref={drag} className="cursor-pointer">
        <p><strong>{message.titulo}</strong></p>
        <p>{message.descripcion}</p>
        <p className="text-sm">Fecha: {message.fecha}</p>
      </li>
    );
  };

  const EstadoDrop = ({ estado, messages, onDrop, onRemoveMessage }) => {
    const [, drop] = useDrop(() => ({
      accept: "MESSAGE",
      drop: (item) => onDrop(estado, item.message),
    }));

    return (
      <div ref={drop} className="border-2 p-2 mb-2">
        <h4>{estado}</h4>
        <ul>
          {messages.map((msg, index) => (
            <li key={index} className="flex justify-between items-center">
              <p><strong>{msg.titulo}</strong></p>
              <button
                className="text-red-500"
                onClick={() => onRemoveMessage(estado, index)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const handleRemoveMessage = (estado, index) => {
    setEstadoMessages((prev) => {
      const newMessages = prev[estado].filter((_, i) => i !== index);
      return { ...prev, [estado]: newMessages };
    });
  };

  const handleDropMessage = (estado, message) => {
    const transformedMessage = {
      estado: estado,
      titulo: message.titulo,
      descripcion: message.descripcion,
      fecha: message.fecha,
    };

    setEstadoMessages((prev) => {
      const newMessages = prev[estado] ? [...prev[estado], transformedMessage] : [transformedMessage];
      return { ...prev, [estado]: newMessages };
    });
  };

  const handleSaveBlockStatus = async () => {
    if (!clientId) {
      setToast({
        show: true,
        type: 'failure',
        message: 'No se puede guardar sin un ID de cliente.',
      });
      return;
    }
  
    const estadoValores = {
      "Inicio": 0,
      "Recibido": 3500,
      "En procesamiento": 7000,
      "Alistado": 11500,
      "Despachado": 12000,
      "Entregado": 15000,
      "Con novedad": 17000
    };
  
    const data = {
      id_cliente: clientId,
      codigo: client.codigo,
      estado: Object.entries(estadoMessages).map(([estado, messages]) => ({
        estado: estadoValores[estado] ?? null,
        mensaje: messages.map(msg => ({
          titulo: msg.titulo,
          descripcion: msg.descripcion,
          fecha: msg.fecha,
        })),
      })),
    };
  
    try {
      await GestorFlujosServ.saveDropStatus(data);
      setToast({
        show: true,
        type: 'success',
        message: 'Estados y mensajes guardados correctamente.',
      });                                        
    } catch (error) {
      console.error("Error guardando el estado del flujo:", error);
      setToast({
        show: true,
        type: 'failure',
        message: 'Error al guardar el estado.',
      });
    } finally {
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-[rgba(26,82,118,0.9)] p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl text-white w-full min-h-screen flex flex-col font-sans">
        {toast.show && (
          <Toast type={toast.type} message={toast.message} />
        )}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 lg:mb-8 text-center text-blue-400 animate-pulse">
          🚀 Gestor de Flujos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 flex-grow">
          <div className="bg-[rgba(26,82,118,0.9)] p-4 sm:p-6 rounded-lg shadow-lg border border-blue-700 hover:shadow-xl transition duration-300 flex flex-col">
            {loading ? (
              <p className="text-blue-400 text-center animate-pulse">Cargando datos...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : client ? (
              <>
                <h2 className="text-lg sm:text-xl font-semibold text-green-400 mb-3 sm:mb-4">✅ Cliente Encontrado</h2>
                <p><strong className="text-gray-300">Código:</strong> {client.codigo || "No disponible"}</p>
                <p><strong className="text-gray-300">Nombre Cliente:</strong> {client.nombre || "No disponible"}</p>

                <h3 className="text-base sm:text-lg font-semibold mt-4 sm:mt-6 text-blue-300">📌 Estados del Cliente</h3>
                <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
                  {estados.map((estadoOption) => (
                    <div key={estadoOption} className="flex items-center space-x-2 sm:space-x-3 group hover:scale-105 transition-transform">
                      <input
                        type="checkbox"
                        id={estadoOption}
                        name={estadoOption}
                        checked={estado[estadoOption] || false}
                        onChange={handleEstadoChange}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
                      />
                      <label htmlFor={estadoOption} className="cursor-pointer text-gray-200 group-hover:text-blue-300 transition duration-200">
                        {estadoOption}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-4 sm:mt-6">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-500 transition duration-300 p-2 sm:p-3 text-white rounded-lg shadow-md font-semibold transform hover:scale-105 hover:shadow-lg"
                    onClick={handleSave}
                  >
                    💾 Guardar Estado
                  </button>
                </div>
              </>
            ) : (
              <p className="text-yellow-500 text-center">⚠ No se encontró un cliente con este código.</p>
            )}
          </div>

          <div className="bg-[rgba(26,82,118,0.9)] p-4 sm:p-6 rounded-lg shadow-lg border border-blue-700 hover:shadow-xl transition duration-300 flex flex-col overflow-auto">
            <h3 className="text-base sm:text-lg font-semibold text-blue-300 mb-2 sm:mb-3">📍 Estados Seleccionados</h3>
            {selectedEstados.size > 0 ? (
              <ul className="list-disc space-y-2 sm:space-y-3 ml-4 sm:ml-5">
                {[...selectedEstados].map((estado, index) => (
                  <li key={index} className="text-gray-300 hover:text-blue-300 transition duration-200">
                    <EstadoDrop
                      estado={estado}
                      messages={estadoMessages[estado] || []}
                      onDrop={handleDropMessage}
                      onRemoveMessage={handleRemoveMessage}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-yellow-500 text-center">⚠ No se han seleccionado estados.</p>
            )}
          </div>

          <div className="bg-[rgba(26,82,118,0.9)] p-4 sm:p-6 rounded-lg shadow-lg border border-blue-700 hover:shadow-xl transition duration-300 flex flex-col overflow-auto">
            <h3 className="text-base sm:text-lg font-semibold text-blue-300">📨 Mensajes</h3>
            {messages.length > 0 ? (
              <ul className="list-disc pl-4 sm:pl-5 border-l-4 border-blue-500 mt-2 sm:mt-3 space-y-2 sm:space-y-3">
                {messages.map((msg) => (
                  <MessageItem key={msg.id} message={msg} />
                ))}
              </ul>
            ) : (
              <p className="text-yellow-500 text-center mt-2">📭 No hay mensajes.</p>
            )}
          </div>
        </div>

        <button
          onClick={handleSaveBlockStatus}
          className="mt-4 sm:mt-6 w-full sm:w-auto bg-blue-600 hover:bg-blue-500 transition duration-300 p-2 sm:p-3 text-white rounded-lg shadow-md font-semibold transform hover:scale-105 hover:shadow-lg"
        >
          Guardar Mensaje 💬
        </button>
      </div>
    </DndProvider>
  );
};

export default FlujoVentana;