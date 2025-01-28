'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../components/dashboard/Dashboard';

export default function DashboardPage() {
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);
    return (
        <>
            <DashboardHeader />
        </>
    );
}
