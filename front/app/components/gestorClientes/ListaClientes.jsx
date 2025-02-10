"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Snackbar, Alert, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ModalAgregarNotificacion from "./ModalAgregarNotificacion";
import ClientApiService from "../../services/GestorCliente/ClientApiService";
import { useRouter } from "next/navigation";

const ListaClientes = ({ refresh }) => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Obtener la lista de clientes y ordenarlos por fecha descendente
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await ClientApiService.getAllClients();
        const sortedData = (response.data || response).sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setData(sortedData);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Hubo un problema al cargar los datos.");
        setOpenSnackbar(true);
      }
    };

    fetchClientes();
  }, [refresh]);

  // Configuración de las columnas de la tabla
  const columns = useMemo(
    () => [
      {
        accessorKey: "codigo",
        header: "Código Cliente",
        size: 150,
      },
      {
        accessorKey: "nombre",
        header: "Nombre Cliente",
        size: 150,
      },
      {
        accessorKey: "estado",
        header: "Estado",
        size: 150,
        Cell: ({ row }) => {
          switch (row.original.estado) {
            case 1:
              return "Activo";
            case 0:
              return "Inactivo";
            default:
              return "Desconocido";
          }
        },
      },
      {
        accessorKey: "fecha",
        header: "Fecha",
        size: 200,
      },
      {
        accessorKey: "usuario",
        header: "Usuario",
        size: 150,
      },
      {
        header: "Acciones",
        size: 150,
        Cell: ({ row }) => (
          <div>
            <ModalAgregarNotificacion
              id={row.original.id}
              onSuccess={() => setData((prevData) => [row.original, ...prevData])}
            />
          </div>
        ),
      },
      {
        header: "Mensajes",
        size: 150,
        Cell: ({ row }) => (
          <div>
            <Tooltip title="Ver">
              <IconButton
                color="primary"
                onClick={() =>
                  router.push(`/dashboard/editarMensajes/${row.original.id}`)
                }
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ],
    [router]
  );

  // Configuración de la tabla utilizando el hook de Material React Table
  const table = useMaterialReactTable({
    columns,
    data,
    enablePagination: true,
    enableExpandAll: false,
    enableExpanding: false,
  });

  // Cierra el Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      {error && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" variant="filled">
            {error}
          </Alert>
        </Snackbar>
      )}

      <MaterialReactTable
        table={table}
        // Personaliza el contenedor de la tabla
        muiTableContainerProps={{
          sx: {
            borderRadius: "10px",
            boxShadow: 2,
            overflow: "hidden",
          },
        }}
        // Personaliza las celdas de encabezado
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: "primary.main",
            color: "white",
            fontWeight: "bold",
            fontSize: "1rem",
          },
        }}
        // Añade efecto hover a las filas del cuerpo de la tabla
        muiTableBodyRowProps={{
          sx: {
            "&:hover": {
              backgroundColor: "grey.100",
            },
          },
        }}
      />
    </Box>
  );
};

export default ListaClientes;
