import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../../../Components/Navbar/Navbar';
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import '../../../Styles/Global.css';

const endpoints = (API) => ({
  OTS: `${API}/ot/ots/`,
});

// Mapeo de estados del backend
const ESTADOS = [
  { value: 'PE', label: 'Pendiente' },
  { value: 'EP', label: 'En progreso' },
  { value: 'CO', label: 'Completado' },
  { value: 'CA', label: 'Cancelado' },
];

export default function Ordenes() {
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const ep = useMemo(() => endpoints(API_URL), [API_URL]);
  const token = sessionStorage.getItem('access');

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // filtros
  const [qTitulo, setQTitulo] = useState('');
  const [qEstado, setQEstado] = useState('ALL'); // ALL | PE | EP | CO | CA

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta OT?")) return;

    try {
      const res = await fetch(`${ep.OTS}${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Error al eliminar OT (status ${res.status})`);

      enqueueSnackbar("OT eliminada correctamente", { variant: "success" });

      // Actualizamos la lista sin recargar todo
      setRows((prev) => prev.filter((ot) => ot.id !== id));
    } catch (err) {
      enqueueSnackbar(err.message || "Error al eliminar OT", { variant: "error" });
    }
  };


  const fetchOTs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      // filtros
      if (qTitulo) params.append('search', qTitulo);
      if (['PE', 'EP', 'CO', 'CA'].includes(qEstado)) params.append('estado', qEstado);

      // ordenar por id ASC
      params.append('ordering', 'id');

      const r = await fetch(`${ep.OTS}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error('No se pudo cargar OTs');
      const data = await r.json();

      let list = Array.isArray(data) ? data : [];
      list = [...list].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));

      setRows(list);
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOTs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBuscar = () => {
    setPage(0);
    fetchOTs();
  };

  const onReset = () => {
    setQTitulo('');
    setQEstado('ALL');
    setPage(0);
    fetchOTs();
  };

  const pag = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleVerDetalle = (id) => {
    navigate(`/ots/ordenes/detalle/${id}`);
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="contenido">
          <h1>Órdenes de Trabajo</h1>

          {/* acciones superiores */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
            <button className="btn-create" onClick={() => navigate('/ots/crearot')}>
              Crear OT
            </button>

            <input
              type="text"
              placeholder="Buscar por título"
              value={qTitulo}
              onChange={(e) => setQTitulo(e.target.value)}
            />
            <select value={qEstado} onChange={(e) => setQEstado(e.target.value)}>
              <option value="ALL">Todas</option>
              {ESTADOS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button onClick={onBuscar}>🔍 Buscar</button>
            <button onClick={onReset}>📋 Ver todos</button>
          </div>

          {!loading && (
            <div className="boxInsumos">
              <table>
                <thead>
                  <tr>
                    <th># OT</th>
                    <th>Título</th>
                    <th>Servicio Principal</th>
                    <th>Estado</th>
                    <th>Fecha creación</th>
                    <th>Responsable</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pag.map((ot) => (
                    <tr key={ot.id}>
                      <td>{ot.id}</td>
                      <td>{ot.titulo}</td>
                      <td>{ot.servicio_principal || '—'}</td>
                      <td>{ot.estado_display || ot.estado || '—'}</td>
                      <td>
                        {ot.fecha_creacion ? new Date(ot.fecha_creacion).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        {ot.usuarios_nombres && ot.usuarios_nombres.length > 0
                          ? ot.usuarios_nombres.join(', ')
                          : '—'}
                      </td>
                      <td style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleVerDetalle(ot.id)}>Detalle</button>
                        <button onClick={() => handleEliminar(ot.id)} style={{ backgroundColor:'red' , color: 'white' }}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <TablePagination
                component="div"
                count={rows.length}
                page={page}
                onPageChange={(e, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                labelRowsPerPage="Filas por página"
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
