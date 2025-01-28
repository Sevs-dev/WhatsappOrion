import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import PageviewIcon from '@mui/icons-material/Pageview';
import ConfigApiService from '../../services/ConfigDatosApi/ConfigDatosServ';



const HistoricoConfig = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const configurations = await ConfigApiService.getAllConfigs();
        setData(configurations);

      } catch (err) {
        console.error('Error fetch todas las configuraciones', err)
      };
    };
    fetchData();
  }, [])
  

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_configuracion', 
        header: 'Id Configuracion',
        size: 100,
      },
      // {
      //   accessorKey: 'token_api', 
      //   header: 'Token API',
      //   size: 50,
      // },
      {
        accessorKey: 'numero_verificacion',
        header: 'Numero Verificacion',
        size: 150,
      },
      {
        accessorKey: 'fecha', 
        header: 'Fecha',
        size: 100,
      },
      {
        accessorKey: 'usuario',
        header: 'Usuario',
        size: 100,
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        size: 100,
      },
      {
        header: 'Acciones',
        size: 150,
        Cell: ({ row }) => (
          <div>
            <Tooltip title="Estado">
                <IconButton
                    color='primary'
                >
                    <ToggleOffIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Probar">
                <IconButton
                    color='primary'
                >
                    <PageviewIcon/>
                </IconButton>
            </Tooltip>
          </div>
        )
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return (
    <div>
      <MaterialReactTable 
        table={table}  
        columns={columns} 
        data={data} 
      />
    </div>
  );
};

export default HistoricoConfig;
