// app/dashboard/layout.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import Sidebard from '../components/sidebar/Sidebard';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);
    return (
        <div className="flex h-screen">
            {/* Sidebar siempre a la izquierda */}
            <Sidebard />

            {/* Contenido principal a la derecha */}
            <div className="flex-grow overflow-y-auto bg-gray-100 p-6">
                {children} {/* Aquí se renderiza el contenido de la página actual */}
            </div>
        </div>
    );
}