'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Home from '../../components/home/Home';
import Loader from '../../components/loader/Loader';

export default function GestorClientesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            // Simulate token validation (you can add additional logic here)
            setTimeout(() => {
                setLoading(false);
            }, 1000); // Simulate a 1-second loading time
        }
    }, [router]);

    if (loading) {
        return <Loader />; // Show the Loader component while validating the token
    }

    return <Home />;
}