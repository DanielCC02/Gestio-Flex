import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../Components/Navbar/Navbar';
import { useSnackbar } from 'notistack';
import '../../../Styles/Global.css';
import '../Insumos/insumos.css'; // reutilizamos el estilo de DetalleInsumo

const DetalleOT = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [ot, setOT] = useState({
    titulo: '',
    fecha_creacion: '',
    servicio_principal: '',
    notas: '',
    estado: '',
    usuarios_nombres: [],
  });

  const [estadoNuevo, setEstadoNuevo] = useState('');
  const [pendUsuarios, setPendUsuarios] = useState([]);

  useEffect(() => {
    const fetchOT = async () => {
      const token = sessionStorage.getItem('access');
      try {
        const res = await fetch(`${API_URL}/ot/ots/${id}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar OT');
        const data = await res.json();
        setOT(data);
        setEstadoNuevo(data.estado || '');
      } catch (err) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    };
    fetchOT();
  }, [API_URL, id, enqueueSnackbar]);

  const handleUpdate = async e => {
    e.preventDefault();
    const token = sessionStorage.getItem('access');
    try {
      // Actualizar estado
      const res = await fetch(`${API_URL}/ot/ots/${id}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: estadoNuevo })
      });
      if (!res.ok) throw new Error('Error al actualizar OT');

      // Asignar usuarios pendientes
      for (const u of pendUsuarios) {
        const r = await fetch(`${API_URL}/otusuario/api/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ot_id: Number(id), usuario_id: Number(u.id) })
        });
        if (!r.ok) throw new Error('No se pudo asignar un usuario');
      }

      enqueueSnackbar('OT actualizada correctamente', { variant: 'success' });
      setPendUsuarios([]);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  const removePendUsuario = idUser =>
    setPendUsuarios(prev => prev.filter(u => u.id !== idUser));

  // Usuarios asignados
  const usuariosAsignados =
    ot.usuarios_nombres ||
    ot.usuarios?.map(u => `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || u.username || `Usuario #${u.id}`) ||
    [];

  return (
    <>
      <Navbar />
      <main>
        <div className="title">
          <h1>DETALLE DE OT</h1>
        </div>

        <div className="contenido">
          <form className="userForm" onSubmit={handleUpdate}>
            <div className="formBox">
              <label># OT</label>
              <input name="id" value={ot.id || ''} readOnly />
            </div>

            <div className="formBox">
              <label>Título</label>
              <input name="titulo" value={ot.titulo} readOnly />
            </div>

            <div className="formBox">
              <label>Fecha de Creación</label>
              <input
                name="fecha_creacion"
                value={ot.fecha_creacion ? new Date(ot.fecha_creacion).toLocaleDateString() : ''}
                readOnly
              />
            </div>

            <div className="formBox">
              <label>Servicio Principal</label>
              <input name="servicio_principal" value={ot.servicio_principal} readOnly />
            </div>

            <div className="formBox">
              <label>Notas</label>
              <input name="notas" value={ot.notas} readOnly />
            </div>

            <div className="formBox">
              <label>Estado</label>
              <select value={estadoNuevo} onChange={e => setEstadoNuevo(e.target.value)} required>
                <option value="PE">Pendiente</option>
                <option value="EP">En progreso</option>
                <option value="CO">Completado</option>
                <option value="CA">Cancelado</option>
              </select>
            </div>

            {/* Usuarios asignados */}
            <div className="formBox">
              <label>Usuarios Asignados</label>
              {usuariosAsignados.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {usuariosAsignados.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
              ) : (
                <p>—</p>
              )}
            </div>

            {/* Usuarios pendientes */}
            {pendUsuarios.length > 0 && (
              <div className="formBox">
                <label>Pendientes por agregar</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {pendUsuarios.map(u => (
                    <span key={u.id} className="tag">
                      {u.label}
                      <button type="button" className="tag-close" onClick={() => removePendUsuario(u.id)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px', width: '100%' }}>
              <button type="submit" className="btnUserForm">Guardar Cambios</button>
              <button
                type="button"
                className="btnUserForm"
                onClick={() => navigate('/ordenes')}
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

export default DetalleOT;
