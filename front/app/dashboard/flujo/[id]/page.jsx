'use client';
import { useParams, useRouter } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import withAuth from "../../../hooks/withAuth";
import FlujoVentana from '../../../components/GestorFlujos/FlujoVentana';

function FlujoVentanaPage() {
    const { id } = useParams();
    const router = useRouter();

    if (!id) {
        return <div>Cargando...</div>;
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <FlujoVentana id={id} />
        </DndProvider>
    );
}

export default withAuth(FlujoVentanaPage);
