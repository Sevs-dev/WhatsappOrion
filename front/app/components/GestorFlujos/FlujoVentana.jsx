import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import GestorFlujosServ from "../../services/GestorFlujos/GestorFlujosServ";
import WhatsappConfig from "../../services/EditarMensajes/GestorEditorMensajes";
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
      <li 
        ref={drag} 
        className="cursor-pointer bg-white/10 p-2 rounded hover:bg-white/15 transition-all border border-transparent hover:border-blue-300/30"
      >
        <p className="font-medium text-sm">{message.titulo}</p>
        <p className="text-xs text-gray-300 line-clamp-2">{message.descripcion}</p>
        <p className="text-xs text-blue-300 mt-1">Fecha: {message.fecha}</p>
      </li>
    );
  };
  
  const EstadoDrop = ({ estado, messages, onDrop, onRemoveMessage }) => {
    const [, drop] = useDrop(() => ({
      accept: "MESSAGE",
      drop: (item) => onDrop(estado, item.message),
    }));
  
    return (
      <div ref={drop} className="border border-blue-300/30 rounded-lg p-3 mb-2 bg-blue-900/30 backdrop-blur-sm hover:border-blue-300/50 transition-all duration-300">
        <h4 className="text-base font-semibold text-blue-300 mb-2 pb-1 border-b border-blue-300/20">{estado}</h4>
        {messages.length > 0 ? (
          <ul className="space-y-2">
            {messages.map((msg, index) => (
              <li key={index} className="bg-white/10 rounded p-2 hover:bg-white/15 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-white text-sm truncate">{msg.titulo}</p>
                  <button
                    className="px-2 py-1 rounded-md text-white bg-red-600 hover:bg-red-500 transition-all text-xs flex-shrink-0"
                    onClick={() => onRemoveMessage(estado, index)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic text-center text-xs py-2">Arrastra mensajes aquí</p>
        )}
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
      api_url: message.api_url,
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
      estados: Object.entries(estadoMessages).flatMap(([estado, messages]) => 
        messages.map(msg => ({
          estado: estadoValores[estado] ?? null,
          titulo: msg.titulo,
          descripcion: msg.descripcion,
          api_url: msg.api_url, 
        }))
      )
    }; 
    
    const dataConfig = {
      codigo: client.codigo,
      estados: Object.entries(estadoMessages).flatMap(([estado, messages]) => 
        messages.map(msg => ({
          estado: estadoValores[estado] ?? null,
          titulo: msg.titulo,
          descripcion: msg.descripcion,
          url: msg.api_url, 
        }))
      )
    };
  
    try {
      await GestorFlujosServ.saveDropStatus(data);
      await WhatsappConfig.sendWhatsappConfig(dataConfig);
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
      <div className="bg-gradient-to-br from-blue-900 to-blue-700/80 p-6 sm:p-8 rounded-3xl shadow-2xl text-white min-h-screen flex flex-col font-sans">
        {toast.show && <Toast type={toast.type} message={toast.message} />}
        
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-white drop-shadow-lg tracking-wide">
          🚀 Gestor de Flujos
        </h1>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
          {/* Cliente */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-transform duration-300 hover:scale-[1.02] flex flex-col">
            {loading ? (
              <p className="text-blue-300 text-center animate-pulse">Cargando datos...</p>
            ) : error ? (
              <p className="text-red-400 text-center">{error}</p>
            ) : client ? (
              <>
                <h2 className="text-xl font-bold text-green-300 mb-4">✅ Cliente Encontrado</h2>
                <p><strong className="text-gray-400">Código:</strong> {client.codigo || "No disponible"}</p>
                <p><strong className="text-gray-400">Nombre:</strong> {client.nombre || "No disponible"}</p>
  
                <h3 className="text-lg font-semibold mt-6 text-blue-300">📌 Estados del Cliente</h3>
                <div className="mt-3 space-y-3">
                {estados.map((estadoOption) => (
                  <div 
                    key={estadoOption} 
                    className="flex items-center space-x-3 group transition-transform duration-300 hover:-translate-y-1"
                  >
                    <input
                      type="checkbox"
                      id={estadoOption}
                      name={estadoOption}
                      checked={estado[estadoOption] || false}
                      onChange={handleEstadoChange}
                      className="w-5 h-5 text-blue-500 border-2 border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <label 
                      htmlFor={estadoOption} 
                      className="text-gray-300 group-hover:text-blue-400 transition"
                    >
                      {estadoOption}
                    </label>
                  </div>
                ))}
              </div>

  
                <button
                  className="w-full bg-blue-500 hover:bg-blue-400 transition p-3 text-white rounded-xl shadow-md font-medium mt-6 hover:scale-105"
                  onClick={handleSave}
                >
                  💾 Guardar Estado
                </button>
              </>
            ) : (
              <p className="text-yellow-400 text-center">⚠ No se encontró un cliente.</p>
            )}
          </div>
  
          {/* Estados seleccionados */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-transform duration-300 hover:scale-[1.02] flex flex-col overflow-hidden">
            <h3 className="text-lg font-bold text-blue-300 mb-3 pb-1 border-b border-blue-300/30">
              📍 Estados Seleccionados
            </h3>
            <div className="overflow-y-auto max-h-[calc(100vh-16rem)] pr-1">
              {selectedEstados.size > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {[...selectedEstados].map((estado, index) => (
                    <div key={index}>
                      <EstadoDrop
                        estado={estado}
                        messages={estadoMessages[estado] || []}
                        onDrop={handleDropMessage}
                        onRemoveMessage={handleRemoveMessage}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-24 text-center">
                  <p className="text-yellow-400 text-sm">⚠ No hay estados seleccionados</p>
                  <p className="text-gray-400 text-xs mt-1">Selecciona estados para comenzar</p>
                </div>
              )}
            </div>
          </div>

          {/* Mensajes */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-transform duration-300 hover:scale-[1.02] flex flex-col overflow-hidden">
          <h3 className="text-lg font-bold text-blue-300 mb-3 pb-1 border-b border-blue-300/30">📨 Mensajes</h3>
          <div className="overflow-y-auto max-h-[calc(100vh-16rem)] pr-1">
            {messages.length > 0 ? (
              <ul className="grid grid-cols-1 gap-2 mt-2">
                {messages.map((msg) => (
                  <MessageItem key={msg.id} message={msg} />
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-24">
                <p className="text-yellow-400 text-sm">📭 No hay mensajes disponibles</p>
              </div>
            )}
          </div>
        </div>
        </div>
        
        <button
          onClick={handleSaveBlockStatus}
          className="mt-8 w-full sm:w-auto bg-blue-500 hover:bg-blue-400 transition p-3 text-white rounded-xl shadow-md font-medium self-center hover:scale-105"
        >
          Guardar Mensaje 💬
        </button>
      </div>
    </DndProvider>
  );
  
};

export default FlujoVentana;