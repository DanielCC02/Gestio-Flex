import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import '../../../Styles/Global.css'; // Aquí ya están los estilos de Usuarios

const Insumos = () => {
  const { enqueueSnackbar } = useSnackbar();
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [insumos, setInsumos] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchInsumos = async () => {
      const token = sessionStorage.getItem('access');
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/insumo/api/?search=${search}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al cargar insumos');
        const data = await response.json();
        setInsumos(data);
      } catch (err) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    };

    fetchInsumos();
  }, [API_URL, search, enqueueSnackbar]);

  const insumosFiltrados = insumos;
  const totalPages = Math.ceil(insumosFiltrados.length / rowsPerPage);
  const insumosPaginados = insumosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Navbar />
      <main>
        <div className="contenido">
          <h1>Gestión de Insumos</h1>

          <button className="btn-create" onClick={() => navigate('/insumos/crear')}>
            + Crear Insumo
          </button>

          <div className="boxInsumos">
            <table border="1" cellPadding="5" className="user-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Unidad</th>
                  <th>Stock</th>
                  <th>Activo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {insumosPaginados.map(i => (
                  <tr key={i.id}>
                    <td>{i.nombre}</td>
                    <td>{i.unidad_medida}</td>
                    <td>{i.stock_actual}</td>
                    <td>{i.activo ? 'Sí' : 'No'}</td>
                    <td>
                      <button onClick={() => navigate(`/insumos/detalle/${i.id}`)}>Ver/Editar</button>
                      <button
                        style={{ marginLeft: '6px', backgroundColor: '#e74c3c', color: '#fff' }}
                        onClick={async () => {
                          if (!confirm(`¿Eliminar el insumo "${i.nombre}"? Esta acción no se puede deshacer.`)) return;
                          try {
                            const token = sessionStorage.getItem('access');
                            const res = await fetch(`${API_URL}/insumo/api/${i.id}/`, {
                              method: 'DELETE',
                              headers: { 'Authorization': `Bearer ${token}` }
                            });
                            if (res.status !== 204) throw new Error('No se pudo eliminar el insumo');
                            enqueueSnackbar('Insumo eliminado', { variant: 'success' });
                            setInsumos(prev => prev.filter(ins => ins.id !== i.id));
                          } catch (err) {
                            enqueueSnackbar(err.message, { variant: 'error' });
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación simple */}
            <div className="pagination">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  className={page === idx ? 'active' : ''}
                  onClick={() => setPage(idx)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Insumos;
