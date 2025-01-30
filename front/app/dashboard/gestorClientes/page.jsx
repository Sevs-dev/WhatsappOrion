'use client';
import withAuth from "../../hooks/withAuth";
import GestorView from '../../components/gestorClientes/GestorView';

function GestorClientesPage() {
    return <GestorView />;
}
export default withAuth(GestorClientesPage);