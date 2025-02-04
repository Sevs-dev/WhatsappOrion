import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';//Icono de apagado
import ToggleOnIcon from '@mui/icons-material/ToggleOn';//Icono de encendido
import PageviewIcon from '@mui/icons-material/Pageview';
import ConfigApiService from '../../services/ConfigDatosApi/ConfigDatosServ';


//Busca los datos para rellenar la tabla
const HistoricoConfig = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const configurations = await ConfigApiService.getAllConfigs();//llama a la api para obtener todas las configuraciones
        setData(configurations);//Guarda los datos obtenidos en el estado `data`

      } catch (err) {
        console.error('Error fetch todas las configuraciones', err)
      };
    };
    fetchData();
  }, [])
  
//Define las columnas de la tabla Usememo  (para evitar que se vuelva a renderizar cada vez que se actualiza el estado)
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
//Define la tabla con los datos obtenidos
  const table = useMaterialReactTable({
    columns,
    data, 
  });
//Retorna la tabla
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
