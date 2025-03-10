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
import ModalAgregarNotificacion from "../gestorClientes/ModalAgregarNotificacion";
import { useRouter } from "next/navigation";

function EdicionMensajeView({ id }) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const router = useRouter();

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
      {/* Header */}
      <div className="grid grid-cols-3 items-center mb-4 bg-[#20415e] p-4 rounded shadow">
        <div className="flex justify-start">
          <Button
            onClick={() => router.push("/dashboard/gestorClientes")}
            className="flex items-center gap-2 bg-[#155E75] text-white font-bold py-2 px-5 rounded-lg shadow-md hover:bg-[#1565c0]"
          >
            <ArrowBackIcon />
            Regresar
          </Button>
        </div>
        <div className="flex justify-center">
          <h1 className="text-2xl font-semibold text-white">
            Mensajes del Cliente
          </h1>
        </div>
        <div className="flex justify-end">
          <ModalAgregarNotificacion id={id} onSaveSuccess={fetchMessages} />
        </div>
      </div>

      {/* Error Snackbar */}
      {error && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}

      {/* Tabla con estilos mejorados */}
      <div className="w-[98%] mx-auto">
        <MaterialReactTable
          table={table}
          muiTableContainerProps={{
            sx: {
              border: "none",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            },
          }}
          muiTablePaperProps={{
            elevation: 0,
            sx: { borderRadius: "8px" },
          }}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: "#20415e",
              color: "white",
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: "0.875rem",
              py: 1,
            },
          }}
          muiTableBodyRowProps={({ row }) => ({
            sx: {
              "&:nth-of-type(odd)": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
              transition: "all 0.2s ease",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
            },
          })}
          muiPaginationProps={{
            sx: {
              backgroundColor: "#f9f9f9",
              borderTop: "1px solid #e0e0e0",
            },
          }}
        />
      </div>

      {/* Modal de edición de mensaje */}
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
