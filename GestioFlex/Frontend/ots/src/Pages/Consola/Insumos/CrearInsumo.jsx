import React, { useState } from 'react';
import Navbar from '../../../Components/Navbar/Navbar';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import '../../../Styles/Global.css';
import './Insumos.css';

const CrearInsumo = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [insumo, setInsumo] = useState({
    nombre: '',
    descripcion: '',
    unidad_medida: '',
    stock_actual: 0,
    stock_minimo: 0,
    precio_unitario: 0,
    activo: true
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setInsumo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = sessionStorage.getItem('access');
    try {
      const res = await fetch(`${API_URL}/insumo/api/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(insumo)
      });
      if (!res.ok) throw new Error('Error al crear insumo');
      enqueueSnackbar('Insumo creado correctamente', { variant: 'success' });
      navigate('/insumos');
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="title">
          <h1>CREAR INSUMO</h1>
        </div>

        <div className="contenido">
          <form className="userForm" onSubmit={handleSubmit}>
            <div className="formBox">
              <label>Nombre</label>
              <input
                name="nombre"
                value={insumo.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="formBox">
              <label>Descripción</label>
              <input
                name="descripcion"
                value={insumo.descripcion}
                onChange={handleChange}
              />
            </div>

            <div className="formBox">
              <label>Unidad de Medida</label>
              <input
                name="unidad_medida"
                value={insumo.unidad_medida}
                onChange={handleChange}
              />
            </div>

            <div className="formBox">
              <label>Stock Actual</label>
              <input
                type="number"
                name="stock_actual"
                value={insumo.stock_actual}
                onChange={handleChange}
              />
            </div>

            <div className="formBox">
              <label>Stock Mínimo</label>
              <input
                type="number"
                name="stock_minimo"
                value={insumo.stock_minimo}
                onChange={handleChange}
              />
            </div>

            <div className="formBox">
              <label>Precio Unitario</label>
              <input
                type="number"
                name="precio_unitario"
                value={insumo.precio_unitario}
                onChange={handleChange}
              />
            </div>

            <div className="formBox">
              <label>
                <input
                  type="checkbox"
                  name="activo"
                  checked={insumo.activo}
                  onChange={handleChange}
                />
                Activo
              </label>
            </div>

            <div className="formBox">
              <button type="submit" className="btnUserForm">Crear Insumo</button>
              <button
                type="button"
                className="btnUserForm"
                onClick={() => navigate('/insumos')}
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default CrearInsumo;
