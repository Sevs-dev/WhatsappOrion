'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FlujoVentana from '../../components/GestorFlujos/FlujoVentana'

export default function GestorClientesPage() {
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);
  return <FlujoVentana />;
}