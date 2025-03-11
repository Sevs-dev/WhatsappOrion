// flujo/[id]/page.jsx (componente de servidor)
import EditMessageClient from './EditMessageClient';
import GestorEditorMensajes from "../../../services/EditarMensajes/GestorEditorMensajes";

export async function generateStaticParams() {
  const clientes = await GestorEditorMensajes.getMessageAll();

  // console.log("Clientes recibidos:", clientes); // Para depurar

  if (!clientes || !Array.isArray(clientes.data)) {
    // console.error("Error: La API no devuelve un array válido.");
    return [];
  }

  return clientes.data.map(cliente => ({
    id: cliente.id_cliente_whatsapp.toString() // Asegúrate de que el ID es el correcto
  }));
}



export default function FlujoVentanaPage({ params }) {
  const { id } = params;
  return <EditMessageClient id={id} />;
}
