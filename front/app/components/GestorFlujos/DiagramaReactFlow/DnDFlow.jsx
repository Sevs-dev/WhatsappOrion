import Toast from "../../toastr/toast.jsx";

import { useRef, useCallback, useEffect, useState } from "react";
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    useReactFlow,
    Background,
    reconnectEdge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import Sidebar from "./Sidebar";
import { DnDProvider, useDnD } from "./DnDContext";
import GestorFlujosServ from "../../../services/GestorFlujos/GestorFlujosServ";

const initialNodes = [];

let id = 0;
const getId = () => `${id++}`;

const DnDFlow = () => {
    const reactFlowWrapper = useRef(null);
    const edgeReconnectSuccessful = useRef(true);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();
    const [type] = useDnD();
    const [editingNode, setEditingNode] = useState(null);
    const [newLabel, setNewLabel] = useState("");

    const [toast, setToast] = useState({ show: false, type: "", message: "" });

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    };

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        []
    );

    const onReconnectStart = useCallback(() => {
        edgeReconnectSuccessful.current = false;
    }, []);

    const onReconnect = useCallback((oldEdge, newConnection) => {
        edgeReconnectSuccessful.current = true;
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    }, []);

    const onReconnectEnd = useCallback((_, edge) => {
        if (!edgeReconnectSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
        edgeReconnectSuccessful.current = true;
    }, []);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const nodeTypeMapping = {
        Inicio: "1",
        En_curso: "2",
        Finalizado: "3",
        Recibido: "4",
    };

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            if (!type) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const nodeId = nodeTypeMapping[type] || getId();

            const newNode = {
                id: nodeId,
                type,
                position,
                data: { label: `${type}` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, type]
    );

    const saveFlow = useCallback(async () => {
        const flowData = { nodes, edges };

        console.log("Estos son los datos que se van a enviar", flowData);
        try {
            const response = await GestorFlujosServ.saveDiagrama(flowData);
            showToast("success", "Datos guardados con éxito en el servidor");
            console.log("Respuesta del servidor:", response);
        } catch (error) {
            console.error("Error guardando los datos en el servidor:", error);
            showToast("failure", "No se pudieron guardar los datos en el servidor. Inténtalo nuevamente.");
        }

        localStorage.setItem("reactflow-diagram", JSON.stringify(flowData));
    }, [nodes, edges]);

    const loadFlow = useCallback(() => {
        const data = {
            nodes: [
                { id: "1", data: { label: "Inicio" }, type: "Inicio", position: { x: 1575, y: -60 } },
                { id: "4", data: { label: "Recibido" }, type: "Recibido", position: { x: 1575, y: 60 } },
                { id: "0", data: { label: "Final" }, type: "Final", position: { x: 1575, y: 195 } },
            ],
            edges: [
                { id: "xy-edge__1-4", source: "1", target: "4" },
                { id: "xy-edge__4-0", source: "4", target: "0" },
            ],
        };

        setNodes(data.nodes || []);
        setEdges(data.edges || []);

        showToast("success", "Datos cargados con éxito");
    }, [setNodes, setEdges]);

    useEffect(() => {
        loadFlow();
    }, [loadFlow]);

    const onNodeDoubleClick = useCallback((event, node) => {
        setEditingNode(node.id);
        setNewLabel(node.data.label);
    }, []);

    const handleLabelChange = (event) => {
        setNewLabel(event.target.value);
    };

    const saveLabel = () => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === editingNode ? { ...node, data: { ...node.data, label: newLabel } } : node
            )
        );
        setEditingNode(null);
    };

    return (
        <div className="dndflow">
            {toast.show && <Toast type={toast.type} message={toast.message} />}
            <div className="save-load-buttons">
                <button onClick={saveFlow}>Guardar</button>
                <button onClick={loadFlow}>Cargar</button>
            </div>
            <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    snapToGrid
                    onNodeDoubleClick={onNodeDoubleClick}
                    fitView
                    style={{ backgroundColor: "#F7F9FB" }}
                >
                    <Controls />
                    <Background />
                </ReactFlow>

                {editingNode && (
                    <div 
                        style={{ 
                            position: "absolute", 
                            top: 50, 
                            right: 50, 
                            zIndex: 1000,
                            backgroundColor: "#072A47",
                            padding: "15px",
                            borderRadius: "10px",
                            border: "2px solid white",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            color: "white",
                            fontFamily: "Arial, sans-serif",
                        }}
                    >
                        <input
                            type="text"
                            value={newLabel}
                            onChange={handleLabelChange}
                            placeholder="Nuevo texto"
                            style={{ marginRight: "10px", width: "70%", borderRadius: "5px", border: "none" }}
                        />
                        <button onClick={saveLabel}>Guardar</button>
                    </div>
                )}
            </div>

            <Sidebar />
        </div>
    );
};

export default () => (
    <ReactFlowProvider>
        <DnDProvider>
            <DnDFlow />
        </DnDProvider>
    </ReactFlowProvider>
);
