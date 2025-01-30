'use client';
import withAuth from "../../hooks/withAuth";
import FlujoVentana from '../../components/GestorFlujos/FlujoVentana'

function FlujoVentanaPage() {
    return <FlujoVentana />;
}
export default withAuth(FlujoVentanaPage);