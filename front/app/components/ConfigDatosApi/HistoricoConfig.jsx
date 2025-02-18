import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import PageviewIcon from '@mui/icons-material/Pageview';
import Services from "../../services/EditarMensajes/GestorEditorMensajes";

const HistoricoConfig = () => {
  const [data, setData] = useState([]); // Usamos "data" para los datos de la tabla

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await Services.getWhatsappApi(); // Llamada a la API 
        setData(clientsData); // Asegura que data se establezca correctamente
      } catch (error) {
        console.error('Error fetching clients:', error);
        setData([]); // En caso de error, asignamos un array vacío
      }
    };
  
    fetchClients();
  }, []);

  // Función para manejar el clic en "Probar"
  const handleTestClick = async (id) => {
    try {
      const response = await Services.sendPrueba(id); // Llamada al servicio de prueba con el id
      if (response.success) {
        alert('Mensaje de prueba enviado correctamente!');
      } else {
        alert('Hubo un error al enviar el mensaje.');
      }
    } catch (error) {
      alert('Error al intentar enviar el mensaje de prueba.');
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'api_url',
        header: 'URL',
        size: 100,
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        size: 100,
        Cell: ({ row }) => (
          <span style={{ color: row.original.estado === 1 ? 'green' : 'red', fontWeight: 'bold' }}>
            {row.original.estado === 1 ? 'Activo' : 'Inactivo'}
          </span>
        ),
      },
      {
        accessorKey: 'number_test',
        header: 'Numero de Prueba',
        size: 100,
      },
      {
        accessorKey: 'created_at',
        header: 'Fecha',
        size: 100,
      },
      {
        header: 'Acciones',
        size: 150,
        Cell: ({ row }) => (
          <div>
            <Tooltip title="Probar">
              <IconButton color="primary" onClick={() => handleTestClick(row.original.id)}>
              <VisibilityIcon />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
  });

  return (
    <div>
      <MaterialReactTable table={table} columns={columns} data={data} />
    </div>
  );
};

export default HistoricoConfig;
