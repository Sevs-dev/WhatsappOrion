"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";
import { Box, Snackbar, Alert } from "@mui/material";
import { IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListaNotificaciones from "./ListaNotificacion";
import ModalAgregarNotificacion from "./ModalAgregarNotificacion";
import ClientApiService from "../../services/GestorCliente/ClientApiService";
import { useRouter } from 'next/navigation'; // Use Next.js's useRouter

const ListaClientes = ({ refresh }) => {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await ClientApiService.getAllClients();
                const sortedData = (response.data || response).sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Ordenar por fecha descendente
                setData(sortedData);
            } catch (err) {
                console.error("Error fetching clients:", err);
                setError("Hubo un problema al cargar los datos.");
                setOpenSnackbar(true);
            }
        };

        fetchClientes();
    }, [refresh]); // El useEffect se ejecuta cada vez que 'refresh' cambia

    const handleClientCreated = (newClient) => {
        // Agrega el nuevo cliente al principio de la lista
        setData((prevData) => [newClient, ...prevData]);
    };

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
                            return "Desconocido"; // En caso de un estado inesperado
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
                        {/* Pasando el id del cliente correctamente al ModalAgregarNotificacion */}
                        <ModalAgregarNotificacion
                            id={row.original.id}
                            onSuccess={() => setRefreshData(prev => !prev)} // Cambia el estado de refresh
                        />
                    </div>
                ),
            },
            {
                header: "Mensajes",
                size: 150,
                Cell: ({ row }) => (
                    <div>
                        {/* Pasando el id del cliente correctamente al ModalAgregarNotificacion */}
                        <Tooltip title="Ver">
                            <IconButton
                                color="primary"
                                onClick={() => router.push(`/dashboard/editarMensajes/${row.original.id}`)}
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

    // Configuración de la tabla
    const table = useMaterialReactTable({
        columns,
        data,
        enablePagination: true,  // Asegurarse de que la paginación esté habilitada
        enableExpandAll: false, // Deshabilitar el botón de expandir todo
        enableExpanding: false, // ❌ Deshabilita la funcionalidad de expansión
    });

    // Manejo de la visibilidad del Snackbar
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div>
            {error && (
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert severity="error">{error}</Alert>
                </Snackbar>
            )}
            <MaterialReactTable table={table} />
        </div>
    );
};

export default ListaClientes;
