"use client"; // Agrega esta línea en la parte superior del archivo

import React, { useEffect, useMemo, useState } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import ListaNotificaciones from "./ListaNotificacion";
import ModalAgregarNotificacion from "./ModalAgregarNotificacion";
import axios from "axios";
import ClientApiService from "../../services/GestorCliente/ClientApiService";

const ListaClientes = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMensajes = async () => {
            try {
                const response = await ClientApiService.getAllClients();
                setData(response.data);
            } catch (err) {
                console.error("Error fetching clients:", err);
                setError("Hubo un problema al cargar los datos.");
            }
        };

        fetchMensajes();
    }, []);

    // Configuración de las columnas de la tabla
    const columns = useMemo(
        () => [
            {
                accessorKey: "id_cliente_whatsapp",
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
                Cell: ({ row }) => (row.original.estado === 1 ? "Activo" : "Inactivo"),
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
                        <ModalAgregarNotificacion id_cliente_whatsapp={row.original.id_cliente_whatsapp} />
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
            row.original.id_cliente_whatsapp ? (
                <Box
                    sx={{
                        display: "grid",
                        margin: "auto",
                        gridTemplateColumns: "1fr",
                        width: "100%",
                    }}
                >
                    <ListaNotificaciones id_cliente={row.original.id_cliente_whatsapp} />
                </Box>
            ) : null,
    });

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <MaterialReactTable table={table} />
        </div>
    );
};

export default ListaClientes;