'use client';
import withAuth from "../../hooks/withAuth";
import ConfigData from '../../components/ConfigDatosApi/ConfigDatosView';

function ConfigDataPage() {
    return <ConfigData />;
}
export default withAuth(ConfigDataPage);