'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import Sidebar from '../components/sidebar/Sidebard';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="flex h-screen bg-gray-100">
            <div className={`
                fixed top-0 left-0 h-full 
                transition-all duration-300 ease-in-out z-30
                ${isCollapsed ? 'w-20' : 'w-72'}
            `}>
                <Sidebar 
                    isCollapsed={isCollapsed} 
                    toggleSidebar={toggleSidebar}
                />
            </div>

            <main className={`
                flex-1 min-h-screen 
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'ml-20' : 'ml-72'}
            `}>
                <div className="p-6 bg-gray-100 min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
