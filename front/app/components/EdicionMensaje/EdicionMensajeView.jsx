import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Snackbar, Alert, Tooltip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import GestorEditorMensajes from "../../services/EditarMensajes/GestorEditorMensajes";
import ModalEdicionMensaje from "./ModalEdicionMensaje";

function EdicionMensajeView({ id }) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (id) {
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
    
     {/* Encabezado */}
     <div className="header mb-4">
        <h1>Mensajes del Cliente</h1>
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
          onUpdate={async () => {
            try {
              const response = await GestorEditorMensajes.getMessagesByClientId(id);
              if (Array.isArray(response.data)) {
                const sortedData = response.data.sort(
                  (a, b) => new Date(b.fecha) - new Date(a.fecha)
                );
                setMessages(sortedData);
              }
              setSelectedMessage(null);
            } catch (err) {
              console.error("Error al recargar los mensajes:", err);
              setError("Hubo un problema al recargar los mensajes.");
              setOpenSnackbar(true);
            }
          }}
        />
      )}
    </Box>
  );
}

export default EdicionMensajeView;