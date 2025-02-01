import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './css/style.css';
import './charts/ChartjsConfig';
import { Toaster } from 'sonner';

// Import pages
import Login from './pages/Login';
import MainLayout from './components/layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Empresas from './pages/Empresas';
import Sucursales from './pages/Sucursales';
import Entidades from './pages/Entidades';
import Usuarios from './pages/Usuarios';
import CrearOperacion from './pages/operaciones/CrearOperacion';
import Transacciones from './pages/operaciones/Transacciones';

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]); // Se ejecuta cuando cambia la ruta

  return (
    <>
      <Toaster richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='/empresas' element={<Empresas />} />
          <Route path='/sucursales' element={<Sucursales />} />
          <Route path='/entidades' element={<Entidades />} />
          <Route path='/usuarios' element={<Usuarios />} />
          <Route path='/operaciones/crear/:tipo' element={<CrearOperacion />} />
          <Route path='/operaciones' element={<Transacciones />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;