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
     
      
      <div className="header mb-4">
      <Button
      variant="contained"
      color="primary"
      onClick={() => router.push('/dashboard/gestorClientes')}
      style={{
        marginBottom: '16px',
        backgroundColor: '#155E75',
        color: 'white',
        fontWeight: 'bold',
        padding: '10px 20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        '&:hover': {
          backgroundColor: '#1565c0',
        },
      }}
    >
      <ArrowBackIcon />
      Regresar
    </Button>
        <h1>Mensajes del Cliente</h1>
        <ModalAgregarNotificacion id={id} onSaveSuccess={fetchMessages} />
      </div>
      
      {error && (
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
      <div style={{ width: '98%', margin: '0 auto' }}>
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