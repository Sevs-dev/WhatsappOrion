'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfigData from '../../components/ConfigDatosApi/ConfigDatosView';
import Loader from '../../components/loader/Loader';

export default function GestorClientesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            // Simula una validación del token (puedes agregar lógica adicional aquí)
            setTimeout(() => {
                setLoading(false);
            }, 1000); // Simula un tiempo de carga de 1 segundo
        }
    }, [router]);

    if (loading) {
        return <Loader />; // Muestra el componente Loader mientras se valida el token
    }

    return <ConfigData />;
}