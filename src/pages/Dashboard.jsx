import React from 'react';
import HeaderLayout from '../components/layouts/HeaderLayout';
import {
  ArrowUp,
  ArrowDown,
  DollarSign,
  BarChart2,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users
} from 'lucide-react';

const Dashboard = () => {
  // Datos de ejemplo - reemplazar con tus datos reales
  const stats = {
    currentMonth: {
      earnings: 12500,
      change: 12.5,
      progress: 75
    },
    previousMonth: {
      earnings: 11100,
      change: -3.2,
      progress: 60
    },
    currentStats: {
      sales: 245,
      customers: 189,
      change: 8.7
    },
    previousStats: {
      sales: 225,
      customers: 174,
      change: -2.1
    }
  };

  return (
    <>
      <HeaderLayout title="Inicio" />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500">ESTADÍSTICAS DEL DIA</h3>
              <BarChart2 className="text-purple-500 w-7 h-7" />
            </div>
            <div className="flex justify-between mb-2">
              <div>
                <p className="text-sm text-gray-500">OPERACIONES</p>
                <p className="text-xl font-bold text-gray-800">
                  {stats.currentStats.sales}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">GANANCIAS</p>
                <p className="text-xl font-bold text-gray-800">
                  {stats.currentStats.customers}
                </p>
              </div>
            </div>

          </div>


          {/* Estadísticas este mes */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500">ESTADÍSTICAS ESTE MES</h3>
              <BarChart2 className="text-purple-500 w-7 h-7" />
            </div>
            <div className="flex justify-between mb-2">
              <div>
                <p className="text-sm text-gray-500">OPERACIONES</p>
                <p className="text-xl font-bold text-gray-800">
                  {stats.currentStats.sales}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">GANANCIAS</p>
                <p className="text-xl font-bold text-gray-800">
                  {stats.currentStats.customers}
                </p>
              </div>
            </div>

          </div>

          {/* Estadísticas mes anterior */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500">ESTADÍSTICAS MES ANTERIOR</h3>
              <Users className="text-amber-500 w-7 h-7" />
            </div>
            <div className="flex justify-between mb-2">
              <div>
                <p className="text-sm text-gray-500">OPERACIONES</p>
                <p className="text-xl font-bold text-gray-800">
                  {stats.previousStats.sales}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">GANANCIAS</p>
                <p className="text-xl font-bold text-gray-800">
                  {stats.previousStats.customers}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;