"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";
import { Box, Snackbar, Alert } from "@mui/material";
import ListaNotificaciones from "./ListaNotificacion";
import ModalAgregarNotificacion from "./ModalAgregarNotificacion";
import ClientApiService from "../../services/GestorCliente/ClientApiService";

const ListaClientes = ({ refresh }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [refreshData, setRefreshData] = useState(false);


    useEffect(() => {
        const fetchMensajes = async () => {
            try {
                const response = await ClientApiService.getAllClients();
                setData(response.data || response); // Ajusta según la estructura de la respuesta
            } catch (err) {
                console.error("Error fetching clients:", err);
                setError("Hubo un problema al cargar los datos.");
                setOpenSnackbar(true);
            }
        };

        fetchMensajes();
    }, [refreshData]); // El useEffect se ejecuta cada vez que 'refresh' cambie

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
        ],
        []
    );

    // Configuración de la tabla
    const table = useMaterialReactTable({
        columns,
        data,
        enableExpandAll: false, // Deshabilitar el botón de expandir todo
        muiDetailPanelProps: () => ({
            sx: (theme) => ({
                backgroundColor:
                    theme.palette.mode === "dark"
                        ? "rgba(255,210,244,0.1)"
                        : "rgba(0,0,0,0.1)",
            }),
        }),
        // Renderización condicional del panel de detalles
        renderDetailPanel: ({ row }) =>
            row.original.id ? (
                <Box
                    sx={{
                        display: "grid",
                        margin: "auto",
                        gridTemplateColumns: "1fr",
                        width: "100%",
                    }}
                >
                    <ListaNotificaciones id={row.original.id} />
                </Box>
            ) : null,
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
