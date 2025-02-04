import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import GestorFlujosServ from "../../services/GestorFlujos/GestorFlujosServ";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const FlujoVentana = ({ id }) => {
  const estados = [
    "Inicio", "Recibido", "En procesamiento", "En alistamiento",
    "Alistado", "Verificado", "En transporte", "En transito",
    "Entregado", "Con novedad", "Final",
  ];

  const [client, setClient] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [selectedEstados, setSelectedEstados] = useState(new Set());
  const [estado, setEstado] = useState({});
  const [messageId, setMessageId] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setError("No se puede guardar sin un ID de cliente.");
      return;
    }
    if (selectedEstados.size === 0) {
      setError("Debe seleccionar al menos un estado.");
      return;
    }

    const data = {
      id_api: clientId,
      estados: JSON.stringify([...selectedEstados]),
      message: messageId,
    };

    try {
      await GestorFlujosServ.saveEstadoFlujo(data);
      alert("Estado guardado correctamente.");
    } catch (error) {
      console.error("Error guardando el estado del flujo:", error);
      setError("Error al guardar el estado.");
    }
  };

  // UseEffect para obtener los mensajes asociados al cliente usando su ID (usando el microservicio)
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

  const EstadoDrop = ({ estado, messages, onDrop }) => {
    const [, drop] = useDrop(() => ({
      accept: "MESSAGE",
      drop: (item) => onDrop(estado, item.message),
    }));

    return (
      <div ref={drop} className="border-2 p-2 mb-2">
        <h4>{estado}</h4>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <p><strong>{msg.titulo}</strong></p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const [estadoMessages, setEstadoMessages] = useState({});

  const handleDropMessage = (estado, message) => {
    setEstadoMessages((prev) => {
      const newMessages = prev[estado] ? [...prev[estado], message] : [message];
      return { ...prev, [estado]: newMessages };
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex bg-gray-800 p-6 rounded-lg shadow-lg text-white max-w-full mx-auto">
        <div className="w-1/2 pr-4">
          <h1 className="text-xl font-bold mb-2">Gestor de Flujos</h1>
          {loading ? (
            <p className="text-blue-400">Cargando datos...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : client ? (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Cliente Encontrado</h2>
              <p><strong>Código:</strong> {client.codigo || "No disponible"}</p>
              <p><strong>Nombre Cliente:</strong> {client.nombre || "No disponible"}</p>
              <h3 className="text-md font-semibold mt-4">Estados del Cliente</h3>
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
              <div className="mt-4">
                <button className="bg-blue-600 p-2 text-white rounded" onClick={handleSave}>
                  Guardar Estado
                </button>
              </div>
            </div>
          ) : (
            <p className="text-yellow-500 mt-2">No se encontró un cliente con este código.</p>
          )}
        </div>
        <div className="w-1/2 pl-4">
          <h3 className="text-lg font-semibold mb-2">Estados Seleccionados</h3>
          {selectedEstados.size > 0 ? (
            <ul className="list-disc ml-5">
              {[...selectedEstados].map((estado, index) => (
                <li key={index}>
                  <EstadoDrop estado={estado} messages={estadoMessages[estado] || []} onDrop={handleDropMessage} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-yellow-500">No se han seleccionado estados.</p>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Mensajes del Cliente</h3>
          {messages.length > 0 ? (
            <ul className="list-disc pl-5 border">
              {messages.map((msg) => (
                <MessageItem key={msg.id} message={msg} />
              ))}
            </ul>
          ) : (
            <p className="text-yellow-500">No hay mensajes para este cliente.</p>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default FlujoVentana;
