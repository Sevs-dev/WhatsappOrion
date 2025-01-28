'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GestorView from '../../components/gestorClientes/GestorView'

export default function GestorClientesPage() {
  const router = useRouter();
      useEffect(() => {
          const token = localStorage.getItem('token');
          if (!token) {
              router.push('/login');
          }
      }, [router]);
  return <GestorView />;
}