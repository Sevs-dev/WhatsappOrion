import { useDnD } from './DnDContext';


// eslint-disable-next-line react-refresh/only-export-components, react/display-name
export default () => {
    // eslint-disable-next-line no-unused-vars
    const [_, setType] = useDnD();

    const onDragStart = (event, nodeType) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside>
            <div className="description">Seleccione los estados de flujo</div>
            <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'Inicio')} draggable>
                Inicio
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Recibido')} draggable>
                Recibido
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'En procesamiento')} draggable>
                En procesamiento
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'En alistamiento')} draggable>
                En alistamiento
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Alistado')} draggable>
                Alistado
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Verificado')} draggable>
                Verificado
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'En transporte')} draggable>
                En transporte
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'En transito')} draggable>
                En transito
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Entregado')} draggable>
                Entregado
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Con novedad')} draggable>
                Con novedad
            </div>
            <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'Final')} draggable>
                Final
            </div>
        </aside>
    );
};