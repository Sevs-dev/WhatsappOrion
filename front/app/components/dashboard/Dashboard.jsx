// app/dashboard/layout.js
'use client';

import React from 'react';
import Sidebard from '../sidebar/Sidebard';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar siempre a la izquierda */}
      <Sidebard />

      {/* Contenido principal a la derecha */}
      <div className="flex-grow overflow-y-auto bg-gray-100 p-6">
        {children} {/* Render the nested route content here */}
      </div>
    </div>
  );
}