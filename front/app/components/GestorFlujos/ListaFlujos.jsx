"use client"; // Mark this component as a Client Component

import { useMemo } from 'react';
import { useRouter } from 'next/navigation'; // Use Next.js's useRouter
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditarFlujoModal from './EditarFlujoModal';
import BlockIcon from "@mui/icons-material/Block";

// Example data
const data = [
  {
    id: 1,
    nameFlujo: 'Flujo 1',
    nameCliente: 'Cliente A',
    fecha: '2023-10-01',
  },
  {
    id: 2,
    nameFlujo: 'Flujo 2',
    nameCliente: 'Cliente B',
    fecha: '2023-10-02',
  },
  {
    id: 3,
    nameFlujo: 'Flujo 3',
    nameCliente: 'Cliente C',
    fecha: '2023-10-03',
  },
];

const ListaFlujos = () => {
  const router = useRouter(); // Use Next.js's useRouter instead of useNavigate

  // Define columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id', 
        header: 'ID',
        size: 150,
      },
      {
        accessorKey: 'nameFlujo',
        header: 'Nombre del flujo',
        size: 150,
      },
      {
        accessorKey: 'nameCliente', 
        header: 'Nombre del cliente',
        size: 200,
      },
      {
        accessorKey: 'fecha',
        header: 'Fecha',
        size: 150,
      },
      {
        header: 'Acciones',
        size: 150,
        Cell: ({ row }) => (
          <div>
            <Tooltip title="Ver">
              <IconButton
                color="primary"
                onClick={() => router.push(`/dashboard/flujo`)} // Use router.push for navigation
              >
                <VisibilityIcon /> 
              </IconButton>
            </Tooltip>

            <EditarFlujoModal />

            <Tooltip title="Deshabilitar">
              <IconButton color="primary">
                <BlockIcon />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ],
    [router] // Add router to the dependency array
  );

  // Create the table instance
  const table = useMaterialReactTable({
    columns,
    data, // Data must be memoized or stable
  });

  return <MaterialReactTable table={table} />;
};

export default ListaFlujos;