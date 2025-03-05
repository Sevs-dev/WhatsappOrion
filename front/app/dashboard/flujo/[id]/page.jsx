// flujo/[id]/page.jsx (componente de servidor)
import FlujoVentanaClient from './FlujoVentanaClient';
import GestorFlujosService from '../../../services/GestorFlujos/GestorFlujosServ';

export async function generateStaticParams() {
    // Obtenemos todos los clientes
    const clientes = await GestorFlujosService.getAllClients();
    // Mapeamos cada cliente para retornar el objeto { id: 'valor' }
    return clientes.map(cliente => ({ id: cliente.id.toString() }));
}

export default function FlujoVentanaPage({ params }) {
    return <FlujoVentanaClient id={params.id} />;
}
