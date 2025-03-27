'use client';

import React from 'react';
import Sidebar from '../sidebar/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />
      {/* Contenido principal */}
      <main className="flex-1 p-6 bg-gray-800 overflow-auto">
        {children}
      </main>
    </div>
  );
}
