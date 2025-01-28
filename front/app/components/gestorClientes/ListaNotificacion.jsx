import React, { useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import ClientApiService from '../../services/GestorCliente/ClientApiService';


const ListaNotificaciones = ({ id_cliente }) => {

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotificaciones = async () => {
            if (!id_cliente) return;

            try {
                const response = await ClientApiService.getNotificationsByClient(id_cliente);
                setData(response.data);
            } catch (err) {
                console.error('Error fetching notifications', err);
                setData([]);
                setError('Hubo un problema al cargar las notificaciones')
            }
        };

        fetchNotificaciones();

    }, [id_cliente]);



    const columns = useMemo(
        () => [
            {
                accessorKey: 'id_mensaje_whatsapp',
                header: 'ID',
                size: 150,
            },
            {
                accessorKey: 'titulo',
                header: 'Titulo',
                size: 150,
            },
            {
                accessorKey: 'descripcion',
                header: 'Descripcion',
                size: 150,
            },
            {
                accessorKey: 'id_url',
                header: 'URL',
                size: 150,
            },
            {
                accessorKey: 'id_cliente_whatsapp',
                header: 'ID',
                size: 150,
            },
            {
                header: 'Acciones',
                size: 150,
                Cell: ({ row }) => (
                    <div>
                        <Tooltip title="Editar">
                            <IconButton
                                color='primary'
                                onClick={() =>
                                    navigate(`/EdicionMensaje`, {
                                        state: { ...row.original },
                                    })}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                )
            },
        ],
        [navigate]
    );

    // Configuración de la tabla
    const table = useMaterialReactTable({
        columns,
        data,
    });



    return <MaterialReactTable table={table} />;
};

export default ListaNotificaciones;
