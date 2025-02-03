import React, { useState, useEffect } from "react";
import GestorFlujosServ from '../../services/GestorFlujos/GestorFlujosServ';

const FlujoVentana = ({ id }) => {
  const [message, setMessage] = useState(null);
  const [client, setClient] = useState(null); // Para almacenar el cliente encontrado
  const [error, setError] = useState(null);
  const [estado, setEstado] = useState({}); // Estado inicial del flujo
  const [clientId, setClientId] = useState(null); // Para almacenar el ID del cliente
  const [selectedEstados, setSelectedEstados] = useState([]); // Para almacenar los estados seleccionados
  const [loading, setLoading] = useState(true); // Estado de carga

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

  useEffect(() => {
    const fetchMessageAndClient = async () => {
      try {
        // Primero, obtener el mensaje
        const messageData = await GestorFlujosServ.getMessageById(id);
        setMessage(messageData);

        const codigo = messageData?.data?.codigo; // Asegúrate de que esto se obtenga correctamente

        if (codigo) {
          // Buscar el cliente usando el código
          const clientData = await GestorFlujosServ.getClientByCodigo(codigo);
          setClient(clientData); // Guardar el cliente encontrado
          setClientId(clientData?.id); // Guardar el ID del cliente

          // Ahora obtener los estados del cliente
          fetchClientStates(clientData?.id); // Llamar a la función para obtener los estados
        } else {
          setError('Código no encontrado en el mensaje.');
        }
      } catch (err) {
        setError('No se pudo obtener los datos.');
        console.error(err);
      } finally {
        setLoading(false); // Aseguramos que la carga termine
      }
    };

    fetchMessageAndClient();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GestorFlujosServ.getClientStates(clientId);  // Asegúrate de que la URL es la correcta
        console.log("Respuesta del servidor con los estados:", response.data);

        // Asegúrate de convertir la cadena JSON a un array
        const estadosArray = JSON.parse(response.data.estados);

        setSelectedEstados(estadosArray);
        setEstado(estadosArray.reduce((acc, curr) => ({ ...acc, [curr]: true }), {}));
      } catch (err) {
        console.error("Error obteniendo los estados del cliente:", err);
        setError("Error al obtener los estados del cliente.");
      }
    };

    fetchData();
  }, []);


  const fetchClientStates = async (clientId) => {
    try {
        const response = await GestorFlujosServ.getClientStates(clientId);
        const estados = response.estados;  // Ahora es un arreglo parseado

        setSelectedEstados(estados);
        console.log("Respuesta del servidor con los estados parseados:", response);

        // Creamos un objeto para manejar el estado, ej.: { "Inicio": true, "Recibido": true, ... }
        setEstado(estados.reduce((acc, curr) => ({ ...acc, [curr]: true }), {}));
    } catch (err) {
        console.error("Error obteniendo los estados del cliente:", err);
        setError("Error al obtener los estados del cliente.");
    }
};


  const { nombre, codigo } = client || {};

  // Manejo de cambios en los checkboxes
  const handleEstadoChange = (event) => {
    const { name, checked } = event.target;

    // Solo actualizar selectedEstados si el estado es diferente al valor actual
    setSelectedEstados((prev) => {
      if (checked && !prev.includes(name)) {
        return [...prev, name];
      } else if (!checked && prev.includes(name)) {
        return prev.filter((estado) => estado !== name);
      }
      return prev;
    });

    // Actualizar estado local (solo lo mantengo por claridad, puede omitirse si no es necesario)
    setEstado((prevEstado) => ({
      ...prevEstado,
      [name]: checked
    }));
  };

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
    };

    try {
      const response = await GestorFlujosServ.saveEstadoFlujo(data);
      console.log("Estado guardado con éxito:", response);
      alert("Estado guardado correctamente.");
    } catch (error) {
      console.error("Error guardando el estado del flujo:", error);
      setError("Error al guardar el estado.");
    }
  };

  // Mostrar loader mientras los datos se cargan
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
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FlujoVentana;
