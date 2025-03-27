"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaRegChartBar, FaRegUserCircle, FaEnvelope } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import ClientApiService from "../../services/GestorCliente/ClientApiService";
import Mensajes from "../../services/EditarMensajes/GestorEditorMensajes";
import Drop from "../../services/GestorFlujos/GestorFlujosServ";

// Función para contar estados de flujos
const countDropStates = (dropArray) => {
  const initialCounts = {
    "Inicio": 0,
    "Recibido": 0,
    "En procesamiento": 0,
    "Alistado": 0,
    "Despachado": 0,
    "Entregado": 0,
    "Con novedad": 0,
  };

  dropArray.forEach((item) => {
    if (item.estados) {
      try {
        const estadosArr = JSON.parse(item.estados);
        estadosArr.forEach((state) => {
          if (initialCounts.hasOwnProperty(state)) {
            initialCounts[state]++;
          }
        });
      } catch (error) {
        console.error("Error al parsear estados:", error);
      }
    }
  });

  return initialCounts;
};

// Tarjeta con gráfica de dona compacta
const CompactDonutCard = ({ title, value, total, color, icon }) => (
  <motion.div 
    className="bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-700 hover:border-gray-600 transition-all"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center space-x-4">
      <div className="w-20 h-20">
        <CircularProgressbar
          value={value}
          maxValue={total}
          styles={buildStyles({
            pathColor: color,
            textColor: 'white',
            trailColor: 'rgba(255,255,255,0.1)',
            textSize: '14px',
            strokeLinecap: 'butt',
            pathTransitionDuration: 1.5,
            strokeWidth: 8,
          })}
        />
      </div>
      
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <div className="flex items-center space-x-2">
          {icon && React.cloneElement(icon, { className: "text-xl text-gray-400" })}
          <CountUp 
            start={0} 
            end={value} 
            duration={1.5} 
            className="text-2xl font-bold text-white"
          />
        </div>
        <p className="text-gray-500 text-xs mt-1">Total: {total}</p>
      </div>
    </div>
  </motion.div>
);

// Componente de estado de flujos
const FlowState = ({ title, count, color }) => (
  <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
    <p className="text-white font-medium">{title}</p>
    <p className={`text-${color}-400 font-bold text-lg`}>{count}</p>
  </div>
);

function Dashboard() {
  const [data, setData] = useState({
    totalClientes: 0,
    clientesActivos: 0,
    clientesInactivos: 0,
    mensajes: 0,
    clientesGetClients: 0,
  });

  const [dropStatesCounts, setDropStatesCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientes, allClientes, mensajesData, dropData] = await Promise.all([
          ClientApiService.getClients(),
          ClientApiService.getAllClients(),
          Mensajes.getMessageAll(),
          Drop.getAllDrop(),
        ]);

        const mensajesCount = mensajesData?.data?.length || 0;
        const activos = allClientes.filter(c => c.estado).length;

        setData({
          totalClientes: allClientes.length,
          clientesActivos: activos,
          clientesInactivos: allClientes.length - activos,
          mensajes: mensajesCount,
          clientesGetClients: clientes.length,
        });

        setDropStatesCounts(countDropStates(dropData?.data || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto p-8">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-700 rounded-xl h-32"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto p-6"> 

        {/* Sección principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Clientes Registrados */}
          <CompactDonutCard 
            title="Clientes Registrados"
            value={data.clientesGetClients}
            total={data.totalClientes}
            color="#10B981"
            icon={<IoIosPeople />}
          />
          
          {/* Mensajes Enviados */}
          <CompactDonutCard 
            title="Mensajes Enviados"
            value={data.mensajes}
            total={data.mensajes * 1.2} 
            color="#3B82F6"
            icon={<FaEnvelope />}
          />
          
          {/* Actividad General */}
          <CompactDonutCard 
            title="Actividad General"
            value={data.clientesActivos}
            total={data.totalClientes}
            color="#F59E0B"
            icon={<FaRegChartBar />}
          />
        </div>

        {/* Sección de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Clientes */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-xl font-semibold text-white">Estados de Clientes</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CompactDonutCard 
                title="Activos"
                value={data.clientesActivos}
                total={data.totalClientes}
                color="#10B981"
                icon={<FaRegUserCircle />}
              />
              <CompactDonutCard 
                title="Inactivos"
                value={data.clientesInactivos}
                total={data.totalClientes}
                color="#EF4444"
                icon={<FaRegUserCircle />}
              />
            </div>
          </div>

          {/* Flujos */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-xl font-semibold text-white">Estados de Flujos</h3>
            
            <div className="space-y-2">
              {Object.entries(dropStatesCounts).map(([state, count]) => (
                <FlowState 
                  key={state}
                  title={state}
                  count={count}
                  color={stateColors[state]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Colores para estados de flujos
const stateColors = {
  "Inicio": "blue",
  "Recibido": "green",
  "En procesamiento": "yellow",
  "Alistado": "purple",
  "Despachado": "pink",
  "Entregado": "teal",
  "Con novedad": "red",
};

export default Dashboard;