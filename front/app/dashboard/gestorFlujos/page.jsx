'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GestorFlujo from '../../components/GestorFlujos/GestorFlujoView';

export default function GestorFlujosPage() {
  const router = useRouter();
      useEffect(() => {
          const token = localStorage.getItem('token');
          if (!token) {
              router.push('/login');
          }
      }, [router]);
  return <GestorFlujo />;
}