// flujo/[id]/page.jsx (componente de servidor)
import EditMessageClient from './EditMessageClient'; 
import GestorEditorMensajes from "../../../services/EditarMensajes/GestorEditorMensajes";

export async function generateStaticParams() {
    const clientes = await GestorEditorMensajes.getMessageAll(); 
    return clientes.data.map(cliente => ({ id: cliente.id.toString() }));
  }

export default function FlujoVentanaPage({ params }) {
    return <EditMessageClient id={params.id} />;
}
