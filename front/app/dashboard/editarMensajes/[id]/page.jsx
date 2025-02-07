'use client';
import { useParams } from 'next/navigation';
import withAuth from "../../../hooks/withAuth";
import EditarMensaje from '../../../components/EdicionMensaje/EdicionMensajeView';

function EditarMensajePage() {
    const { id } = useParams(); // Obtenemos el id desde la URL

    if (!id) {
        return <div>Cargando...</div>; // Si no hay id, espera
    }

    return <EditarMensaje id={id} />; // Pasa el id al componente hijo
}

export default withAuth(EditarMensajePage);
