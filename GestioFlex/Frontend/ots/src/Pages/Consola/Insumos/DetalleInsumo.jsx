import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../Components/Navbar/Navbar';
import { useSnackbar } from 'notistack';
import '../../../Styles/Global.css';
import './Insumos.css';

const DetalleInsumo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [insumo, setInsumo] = useState({
    nombre: '', descripcion: '', unidad_medida: '', stock_actual:0, stock_minimo:0,
    precio_unitario:0, activo:true
  });

  useEffect(() => {
    const fetchInsumo = async () => {
      const token = sessionStorage.getItem('access');
      try {
        const res = await fetch(`${API_URL}/insumo/api/${id}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar insumo');
        setInsumo(await res.json());
      } catch (err) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    };
    fetchInsumo();
  }, [API_URL, id, enqueueSnackbar]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setInsumo(prev => ({ ...prev, [name]: type==='checkbox' ? checked : value }));
  };

  const handleUpdate = async e => {
    e.preventDefault();
    const token = sessionStorage.getItem('access');
    try {
      const res = await fetch(`${API_URL}/insumo/api/${id}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' },
        body: JSON.stringify(insumo)
      });
      if (!res.ok) throw new Error('Error al actualizar insumo');
      enqueueSnackbar('Actualizado correctamente', { variant:'success' });
    } catch (err) {
      enqueueSnackbar(err.message, { variant:'error' });
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="title">
          <h1>DETALLE DE INSUMO</h1>
        </div>

        <div className="contenido">
          <form className="userForm" onSubmit={handleUpdate}>
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
              <button type="submit" className="btnUserForm">Guardar Cambios</button>
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

export default DetalleInsumo;
