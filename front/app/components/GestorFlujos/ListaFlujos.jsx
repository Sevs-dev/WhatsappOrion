"use client"; // Mark this component as a Client Component

import { useMemo, useState, useEffect } from 'react'; // Import useState and useEffect
import { useRouter } from 'next/navigation'; // Use Next.js's useRouter
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditarFlujoModal from './EditarFlujoModal';
import BlockIcon from "@mui/icons-material/Block";
import GestorFlujosServ from '../../services/GestorFlujos/GestorFlujosServ';

const ListaFlujos = () => {
  const router = useRouter();
  const [clients, setClients] = useState([]); // Define the clients state
  const [loading, setLoading] = useState(true); // Define the loading state

  // Llamada a la API para obtener clientes
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await GestorFlujosServ.getAllClients(); // Llamada a la API
        setClients(clientsData); // Guarda los datos en el estado
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false); // Cambia el estado de loading
      }
    };

    fetchClients(); // Ejecutar la función cuando se monte el componente
  }, []);

  // Define columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre',
        header: 'Nombre del cliente',
        size: 200,
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        size: 150,
        Cell: ({ cell }) => (cell.getValue() === 1 ? 'Activo' : 'Inactivo'),
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
                onClick={() => router.push(`/dashboard/flujo/${row.original.id}`)}
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
    data: clients, // Use the clients state here
  });

  if (loading) {
    return <div>Loading...</div>; // Display loading text or spinner while fetching data
  }

  return <MaterialReactTable table={table} />;
};

export default ListaFlujos;
