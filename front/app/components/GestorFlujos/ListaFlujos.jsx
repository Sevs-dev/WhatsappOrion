"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GestorFlujosServ from "../../services/GestorFlujos/GestorFlujosServ";

const ListaFlujos = () => {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await GestorFlujosServ.getAllClients();
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "codigo",
        header: "Código Cliente",
        size: 150,
      },
      {
        accessorKey: "nombre",
        header: "Nombre del cliente",
        size: 200,
      },
      {
        accessorKey: "estado",
        header: "Estado",
        size: 150,
        Cell: ({ cell }) =>
          cell.getValue() === 1 ? "Activo" : "Inactivo",
      },
      {
        accessorKey: "fecha",
        header: "Fecha",
        size: 150,
      },
      {
        header: "Acciones",
        size: 150,
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <Tooltip title="Ver">
              <IconButton
                color="primary"
                onClick={() =>
                  router.push(`/dashboard/flujo/${row.original.id}`)
                }
              >
                <VisibilityIcon />
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
    data: clients,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-2 items-center mb-4 bg-[#20415e] p-4 rounded shadow">
        <h1 className="text-2xl font-bold text-white">Listado de Flujos</h1>
      </div>

      {/* Tabla */}
      <div className="w-[98%] mx-auto">
        <MaterialReactTable
          table={table}
          muiTableContainerProps={{
            className: "rounded shadow-lg border border-gray-200",
          }}
          muiTableHeadCellProps={{
            sx: { backgroundColor: "#20415e", fontWeight: "bold" },
            className: "text-sm text-white uppercase",
          }}
          muiTableBodyRowProps={{
            sx: {
              "&:nth-of-type(odd)": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
            },
            className: "text-sm",
          }}
          muiPaginationProps={{
            className: "mt-4",
          }}
        />
      </div>
    </div>
  );
};

export default ListaFlujos;
