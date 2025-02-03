'use client';
import { useParams, useRouter } from 'next/navigation';
import withAuth from "../../../hooks/withAuth";
import FlujoVentana from '../../../components/GestorFlujos/FlujoVentana';

function FlujoVentanaPage() {
    const { id } = useParams();
    const router = useRouter();

    if (!id) {
        return <div>Cargando...</div>;
    }

    return <FlujoVentana id={id} />;
}

export default withAuth(FlujoVentanaPage);
