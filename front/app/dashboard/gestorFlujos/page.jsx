'use client';
import withAuth from "../../hooks/withAuth";
// import GestorFlujo from '../../components/GestorFlujos/GestorFlujoView';

function GestorFlujosPage() {
  return <GestorFlujo />;
}

export default withAuth(GestorFlujosPage);