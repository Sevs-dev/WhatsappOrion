import React, { useState, useEffect } from "react"; // Importa React y los hooks necesarios
import { useDrag, useDrop } from "react-dnd"; // Importa hooks de react-dnd para habilitar el drag-and-drop
import GestorFlujosServ from "../../services/GestorFlujos/GestorFlujosServ"; // Importa el servicio que interactúa con la API
import { DndProvider } from "react-dnd"; // Importa el proveedor para drag-and-drop
import { HTML5Backend } from "react-dnd-html5-backend"; // Backend de HTML5 para el drag-and-drop

const FlujoVentana = ({ id }) => { // Componente principal que recibe el 'id' como prop
  const estados = [ // Lista de estados posibles para el flujo
    "Inicio", "Recibido", "En procesamiento", "En alistamiento",
    "Alistado", "Verificado", "En transporte", "En transito",
    "Entregado", "Con novedad", "Final",
  ];

  // Definición de estados locales utilizando useState
  const [client, setClient] = useState(null); // Guarda los datos del cliente
  const [clientId, setClientId] = useState(null); // Guarda el ID del cliente
  const [selectedEstados, setSelectedEstados] = useState(new Set()); // Estados seleccionados por el usuario
  const [estado, setEstado] = useState({}); // Representación interna de los estados
  const [messageId, setMessageId] = useState(""); // ID del mensaje
  const [messages, setMessages] = useState([]); // Lista de mensajes del cliente
  const [error, setError] = useState(null); // Estado para manejar errores
  const [loading, setLoading] = useState(true); // Estado de carga

  // useEffect para obtener los datos del cliente cuando cambia 'id'
  useEffect(() => {
    const fetchDataClient = async () => {
      try {
        setLoading(true); // Marca que la carga comenzó
        const datosCliente = await GestorFlujosServ.getClientById(id); // Llama al servicio para obtener los datos del cliente
        if (datosCliente?.data) { // Si se obtiene datos válidos
          setClient(datosCliente.data); // Establece los datos del cliente
          setClientId(datosCliente.data.id); // Establece el ID del cliente
        } else {
          setClient(datosCliente); // Si no tiene la propiedad 'data'
          setClientId(datosCliente.id); // Establece el ID de otra forma
        }
      } catch (err) {
        setError("Error al obtener datos del cliente"); // Maneja el error
        console.error(err);
      } finally {
        setLoading(false); // Marca que la carga terminó
      }
    };

    fetchDataClient(); // Llama a la función de carga
  }, [id]); // Depende de 'id', se ejecuta cuando cambia

  // useEffect para obtener los estados del cliente
  useEffect(() => {
    if (!clientId) return; // Si no hay ID de cliente, no hace nada
    fetchEstados(clientId); // Llama a la función que obtiene los estados
  }, [clientId]); // Depende de 'clientId', se ejecuta cuando cambia

  const fetchEstados = async (id) => { // Función para obtener los estados del cliente
    try {
      const response = await GestorFlujosServ.getClientStates(id); // Llama al servicio para obtener los estados
      if (!response || !response.estados) { // Si no hay estados
        console.warn("No hay estados disponibles para este cliente.");
        setSelectedEstados(new Set()); // Resetea los estados seleccionados
        setEstado({});
        return;
      }

      let estadosArray = response.estados; // Asigna los estados obtenidos
      if (typeof estadosArray === "string") { // Si los estados están en formato de cadena
        try {
          estadosArray = JSON.parse(estadosArray); // Intenta convertir la cadena a un array
        } catch (parseError) {
          console.error("Error al parsear los estados:", parseError);
          estadosArray = [];
        }
      }
      if (!Array.isArray(estadosArray)) estadosArray = []; // Si no es un array, lo resetea

      setSelectedEstados(new Set(estadosArray)); // Establece los estados seleccionados
      setEstado(estadosArray.reduce((acc, curr) => ({ ...acc, [curr]: true }), {})); // Convierte el array en un objeto
    } catch (err) {
      console.error("Error obteniendo estados:", err);
      setError("Error al obtener estados del cliente.");
    }
  };

  const fetchMessages = async (id) => { // Función para obtener los mensajes del cliente
    try {
      const response = await GestorFlujosServ.getMessageById(id); // Llama al servicio para obtener los mensajes
      setMessageId(response.data[0]?.id_cliente_whatsapp); // Establece el ID del mensaje
    } catch (err) {
      console.error("Error obteniendo mensajes:", err);
      setError("Error al obtener mensajes del cliente.");
    }
  };

  useEffect(() => { // useEffect para obtener los mensajes cuando 'clientId' cambia
    if (!clientId) return;
    fetchMessages(clientId);
  }, [clientId]);

  const handleEstadoChange = (event) => { // Función para manejar el cambio de estado (checkbox)
    const { name, checked } = event.target;
    setSelectedEstados((prev) => {
      const newSet = new Set(prev);
      checked ? newSet.add(name) : newSet.delete(name); // Agrega o elimina el estado seleccionado
      return newSet;
    });
    setEstado((prevEstado) => ({
      ...prevEstado,
      [name]: checked, // Actualiza el estado con el nuevo valor
    }));
  };

  const handleSave = async () => { // Función para guardar los estados seleccionados
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
      await GestorFlujosServ.saveEstadoFlujo(data); // Guarda los datos a través del servicio
      alert("Estado guardado correctamente.");
    } catch (error) {
      console.error("Error guardando el estado del flujo:", error);
      setError("Error al guardar el estado.");
    }
  };

  useEffect(() => { // useEffect para obtener los mensajes cuando 'messageId' cambia
    if (!messageId) return;
    const fetchMessages = async () => {
      try {
        const response = await GestorFlujosServ.getMessagesByClientId(messageId); // Llama al servicio para obtener los mensajes asociados
        setMessages(response.data); // Establece los mensajes en el estado
      } catch (err) {
        console.error("Error obteniendo los mensajes del cliente:", err);
        setError("Error al obtener los mensajes del cliente.");
      }
    };

    fetchMessages();
  }, [messageId]);

  const MessageItem = ({ message }) => { // Componente para cada mensaje, habilita el drag
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

  const EstadoDrop = ({ estado, messages, onDrop }) => { // Componente para manejar el drop de mensajes en un estado
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

  const [estadoMessages, setEstadoMessages] = useState({}); // Estado para almacenar los mensajes en cada estado

  const handleDropMessage = (estado, message) => { // Función para manejar el drop de un mensaje en un estado
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
