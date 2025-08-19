import React, { useEffect, useState } from 'react';
import './Styles/Global.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import Login from './Components/Login/Login';
import Inicio from './Pages/Inicio';
import Consola from './Pages/Consola/Consola';

import Usuarios from './Pages/Consola/Usuario/Usuarios';
import UsuarioDetalle from './Pages/Consola/Usuario/UsuariosDetalle';
import CrearUsuario from './Pages/Consola/Usuario/CrearUsuario';

import Insumos from './Pages/Consola/Insumos/Insumos';
import DetalleInsumo from './Pages/Consola/Insumos/DetalleInsumo';
import CrearInsumo from './Pages/Consola/Insumos/CrearInsumo';

import Ordenes from './Pages/Consola/OTs/Ordenes';
import CrearOT from './Pages/Consola/OTs/CrearOT';
import DetalleOT from './Pages/Consola/OTs/DetalleOT';

import Servicios from './Pages/Consola/Servicios/Servicios';
import CrearServicio from './Pages/Consola/Servicios/CrearServicio';
import DetalleServicio from './Pages/Consola/Servicios/DetalleServicio';

import { SessionProvider, useSession } from './Context/sessionContext';

function App() {
  const { isLoggedIn, rol } = useSession();
  const [loading, setLoading] = useState(true);

  const isAdmin = rol === 'admin';
  const isJefatura = rol === 'jefatura';
  const isEmpleado = rol === 'empleado';

  useEffect(() => setLoading(false), []);

  if (loading) return <div>Loading...</div>;

  const getDefaultRoute = () => {
    if (!rol) return '/';
    return '/inicio'; // Todos los roles logueados van a inicio por defecto
  };

  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={isLoggedIn ? <Navigate to={getDefaultRoute()} /> : <Login />} />

        {/* INICIO (todos los usuarios logueados) */}
        <Route path="/inicio" element={isLoggedIn ? <Inicio /> : <Navigate to="/" />} />

        {/* CONSOLA */}
        <Route path="/consola" element={isLoggedIn && (isAdmin || isJefatura || isEmpleado) ? <Consola /> : <Navigate to="/" />} />

        {/* ÓRDENES DE TRABAJO */}
        <Route path="/ordenes" element={isLoggedIn ? <Ordenes /> : <Navigate to="/" />} />
        <Route path="/ots/crearot" element={isLoggedIn && isAdmin ? <CrearOT /> : <Navigate to="/" />} />
        <Route path="/ots/ordenes/detalle/:id" element={isLoggedIn && (isAdmin || isJefatura) ? <DetalleOT /> : <Navigate to="/" />} />

        {/* USUARIOS (solo admin) */}
        <Route path="/usuarios" element={isLoggedIn && isAdmin ? <Usuarios /> : <Navigate to="/" />} />
        <Route path="/usuario/detalle/:id" element={isLoggedIn && isAdmin ? <UsuarioDetalle /> : <Navigate to="/" />} />
        <Route path="/usuario/crear" element={isLoggedIn && isAdmin ? <CrearUsuario /> : <Navigate to="/" />} />

        {/* INSUMOS (admin + jefatura) */}
        <Route path="/insumos" element={isLoggedIn && (isAdmin || isJefatura) ? <Insumos /> : <Navigate to="/" />} />
        <Route path="/insumos/crear" element={isLoggedIn && (isAdmin || isJefatura) ? <CrearInsumo /> : <Navigate to="/" />} />
        <Route path="/insumos/detalle/:id" element={isLoggedIn && (isAdmin || isJefatura) ? <DetalleInsumo /> : <Navigate to="/" />} />

        {/* ÓRDENES DE TRABAJO */}
        <Route path="/ordenes" element={isLoggedIn ? <Ordenes /> : <Navigate to="/" />} />
        <Route path="/ots/crearot" element={isLoggedIn && isAdmin ? <CrearOT /> : <Navigate to="/" />} />
        <Route path="/ots/ordenes/detalle/:id" element={isLoggedIn && (isAdmin || isJefatura) ? <DetalleOT /> : <Navigate to="/" />} />

        {/* SERVICIOS */}
        <Route path="/servicios" element={isLoggedIn && (isAdmin || isJefatura) ? <Servicios /> : <Navigate to="/" />} />
        <Route path="/servicios/crear" element={isLoggedIn && (isAdmin || isJefatura) ? <CrearServicio /> : <Navigate to="/" />} />
        <Route path="/servicios/detalle/:id" element={isLoggedIn && (isAdmin || isJefatura) ? <DetalleServicio /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default function AppWrapper() {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={1000}>
      <SessionProvider>
        <App />
      </SessionProvider>
    </SnackbarProvider>
  );
}
