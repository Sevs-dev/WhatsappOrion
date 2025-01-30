"use client";
import withAuth from "../../hooks/withAuth";
import NuevaConfig from "../../components/GestorFlujos/GestorFlujoView";

function NuevaConfigPage() {
  return <NuevaConfig />;
}

export default withAuth(NuevaConfigPage);
