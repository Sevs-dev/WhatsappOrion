'use client';
import { useParams, useRouter } from 'next/navigation';
import withAuth from "../../../hooks/withAuth";
import EditarMensaje from '../../../components/EdicionMensaje/EdicionMensajeView';

function EditarMensajePage() {
    const { id } = useParams();
    const router = useRouter();

    if (!id) {
        return <div>Cargando...</div>;
    }

    return <EditarMensaje id={id} />;
}

export default withAuth(EditarMensajePage);
