import { useState, useEffect } from 'react';
import ReactFlow, { Background, Controls } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

export default function EditarNodos() {
    const [elements, setElements] = useState([]);
    const [flowInstance, setFlowInstance] = useState(null);
    const [editingNodeId, setEditingNodeId] = useState(null); // Nodo actualmente en edición
    const [newLabel, setNewLabel] = useState(''); // Nuevo texto del nodo

    useEffect(() => {
        const instance = new ReactFlow({
            // configuración de React Flow
        });
        setFlowInstance(instance);
    }, []);

    const onNodeClick = (event, node) => {
        // Eliminar el nodo seleccionado
        if (window.confirm(`¿Eliminar el nodo "${node.data?.label}"?`)) {
            setElements((prevElements) => prevElements.filter((el) => el.id !== node.id));
        }
    };

    const onNodeDoubleClick = (event, node) => {
        // Habilitar modo de edición para el nodo seleccionado
        setEditingNodeId(node.id);
        setNewLabel(node.data?.label || '');
    };

    const handleLabelChange = (event) => {
        setNewLabel(event.target.value);
    };

    const saveLabel = () => {
        setElements((prevElements) =>
            prevElements.map((el) =>
                el.id === editingNodeId
                    ? { ...el, data: { ...el.data, label: newLabel } }
                    : el
            )
        );
        setEditingNodeId(null); // Salir del modo de edición
    };

    const addNode = () => {
        const newNode = {
            id: `node-${elements.length + 1}`,
            type: 'default',
            position: { x: 100 + elements.length * 50, y: 100 },
            data: { label: 'Nuevo nodo' },
        };
        setElements((prevElements) => [...prevElements, newNode]);
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <ReactFlow
                elements={elements}
                onNodeClick={onNodeClick}
                onNodeDoubleClick={onNodeDoubleClick}
                style={{ flex: 1 }}
            >
                <Background />
                <Controls />
            </ReactFlow>
            <button onClick={addNode}>Agregar nodo</button>

            {editingNodeId && (
                <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
                    <input
                        type="text"
                        value={newLabel}
                        onChange={handleLabelChange}
                        placeholder="Nuevo texto"
                        style={{ marginRight: '10px' }}
                    />
                    <button onClick={saveLabel}>Guardar</button>
                </div>
            )}
        </div>
    );
}
