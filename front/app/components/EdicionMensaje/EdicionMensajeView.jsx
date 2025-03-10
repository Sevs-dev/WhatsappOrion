import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Snackbar, Alert, Tooltip, IconButton, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import GestorEditorMensajes from "../../services/EditarMensajes/GestorEditorMensajes";
import ModalEdicionMensaje from "./ModalEdicionMensaje";
import ModalAgregarNotificacion from '../gestorClientes/ModalAgregarNotificacion';
import { useRouter } from 'next/navigation'; // Importa useRouter de Next.js


function EdicionMensajeView({ id }) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const router = useRouter(); // Usa useRouter de Next.js

  const fetchMessages = async () => {
    try {
      const response = await GestorEditorMensajes.getMessagesByClientId(id);
      console.log("Mensajes obtenidos:", response);

      if (Array.isArray(response.data)) {
        const sortedData = response.data.sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setMessages(sortedData);
      } else {
        setMessages([]);
        console.error("Formato de datos inesperado:", response.data);
      }
    } catch (err) {
      console.error("Error al cargar los mensajes:", err);
      setError("Hubo un problema al cargar los mensajes.");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMessages();
    }
  }, [id]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 100,
      },
      {
        accessorKey: "titulo",
        header: "Título",
        size: 200,
        Cell: ({ cell }) => cell.getValue() || "Sin título",
      },
      {
        accessorKey: "descripcion",
        header: "Descripción",
        size: 300,
        Cell: ({ cell }) => cell.getValue() || "Sin descripción",
      },
      {
        accessorKey: "estado_flujo_activacion",
        header: "Estado",
        size: 150,
        Cell: ({ cell }) => (
          <span style={{ color: cell.getValue() === 1 ? "green" : "red" }}>
            {cell.getValue() === 1 ? "Activado" : "Desactivado"}
          </span>
        ),
      },
      {
        accessorKey: "fecha",
        header: "Fecha",
        size: 200,
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
      },
      {
        header: "Acciones",
        size: 100,
        Cell: ({ row }) => (
          <Tooltip title="Editar">
            <IconButton
              color="primary"
              onClick={() => setSelectedMessage(row.original)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: messages,
    enablePagination: true,
    enableExpandAll: false,
    enableExpanding: false,
  });

  return (
    <Box>
      <div className="grid grid-cols-3 items-center mb-4 bg-[#20415e] p-4 rounded shadow">
        {/* Columna Izquierda: Botón de Regresar */}
        <div className="flex justify-start">
          <Button
            onClick={() => router.push('/dashboard/gestorClientes')}
            className="flex items-center gap-2 bg-[#155E75] text-white font-bold py-2 px-5 rounded-lg shadow-md hover:bg-[#1565c0]"
          >
            <ArrowBackIcon />
            Regresar
          </Button>
        </div>

        {/* Columna Central: Título */}
        <div className="flex justify-center">
          <h1 className="text-2xl font-semibold text-white">Mensajes del Cliente</h1>
        </div>

        {/* Columna Derecha: Botón para Agregar Mensaje */}
        <div className="flex justify-end">
          <ModalAgregarNotificacion id={id} onSaveSuccess={fetchMessages} />
        </div>
      </div>

      {error && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}

      <div className="w-[98%] mx-auto">
        <MaterialReactTable table={table} />
      </div>

      {selectedMessage && (
        <ModalEdicionMensaje
          mensaje={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onUpdate={fetchMessages}
        />
      )}
    </Box>
  );
}

export default EdicionMensajeView;