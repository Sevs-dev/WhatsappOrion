"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Box, Snackbar, Alert, IconButton, Tooltip, styled } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ModalAgregarNotificacion from "./ModalAgregarNotificacion";
import ClientApiService from "../../services/GestorCliente/ClientApiService";
import { useRouter } from "next/navigation";

// Styled components
const StyledTableContainer = styled(Box)(({ theme }) => ({
  borderRadius: "15px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
  },
}));

const SnackbarAlert = styled(Alert)(({ theme }) => ({
  backgroundColor: "#ff4444",
  color: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(255,68,68,0.3)",
}));

// Objetos de estilos para el MaterialReactTable
const tableContainerProps = {
  sx: { maxHeight: "calc(100vh - 200px)", borderRadius: "12px", border: "none" },
};

const tablePaperProps = {
  elevation: 0,
  sx: { borderRadius: "12px", border: "none" },
};

const topToolbarProps = {
  sx: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    borderRadius: "12px 12px 0 0",
  },
};

const bottomToolbarProps = {
  sx: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTop: "1px solid rgba(0,0,0,0.1)",
    boxShadow: "0 -2px 6px rgba(0,0,0,0.05)",
    borderRadius: "0 0 12px 12px",
  },
};

const paginationProps = {
  showFirstButton: false,
  showLastButton: false,
  sx: {
    "& .MuiPaginationItem-root": {
      color: "rgba(0,0,0,0.7)",
      fontWeight: 500,
      borderRadius: "50%",
      margin: "0 4px",
      transition: "all 0.3s ease",
    },
    "& .MuiPaginationItem-page.Mui-selected": {
      backgroundColor: "rgba(0,0,0,0.05)",
      color: "rgba(0,0,0,0.9)",
      fontWeight: 600,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
  },
};

const bodyRowProps = ({ row }) => ({
  sx: {
    "&:nth-of-type(odd)": { backgroundColor: "rgba(0,0,0,0.02)" },
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.05)",
      transform: "translateY(-1px)",
      transition: "all 0.2s ease",
    },
  },
});

const headCellProps = {
  sx: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderBottom: "2px solid rgba(0,0,0,0.1)",
    fontWeight: 600,
    color: "rgba(0,0,0,0.8)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
};

const ListaClientes = ({ refresh }) => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

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

  const columns = useMemo(
    () => [
      {
        accessorKey: "codigo",
        header: "Código",
        size: 120,
        Cell: ({ cell }) => (
          <span className="font-mono text-blue-400">{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
        size: 200,
        Cell: ({ cell }) => (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">{cell.getValue()}</span>
          </div>
        ),
      },
      {
        accessorKey: "estado",
        header: "Estado",
        size: 150,
        Cell: ({ row }) => {
          const isActive = row.original.estado === 1;
          const statusColor = isActive ? "green" : "red";
          return (
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full bg-${statusColor}-500`} />
              <span className={`text-${statusColor}-500 font-medium`}>
                {isActive ? "Activo" : "Inactivo"}
              </span>
            </div>
          );
        },
      }, 
      {
        accessorKey: "usuario",
        header: "Responsable",
        size: 180,
      },
      {
        header: "Acciones",
        size: 150,
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <ModalAgregarNotificacion
              id={row.original.id}
              onSuccess={() => setData((prevData) => [row.original, ...prevData])}
            />
            <Tooltip title="Ver mensajes">
              <IconButton
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                }}
                onClick={() =>
                  router.push(`/dashboard/editarMensajes/${row.original.id}`)
                }
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ],
    [router]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enablePagination: true,
    enableColumnResizing: true,
    enableRowNumbers: true,
    enableRowVirtualization: true,
    muiTableBodyRowProps: bodyRowProps,
    muiTableHeadCellProps: headCellProps,
  });

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <StyledTableContainer sx={{ mt: 4 }}>
      {error && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <SnackbarAlert severity="error" variant="filled">
            {error}
          </SnackbarAlert>
        </Snackbar>
      )}

      <MaterialReactTable
        table={table}
        muiTableContainerProps={tableContainerProps}
        muiTablePaperProps={tablePaperProps}
        muiTopToolbarProps={topToolbarProps}
        muiBottomToolbarProps={bottomToolbarProps}
        muiPaginationProps={paginationProps}
      />
    </StyledTableContainer>
  );
};

export default ListaClientes;
