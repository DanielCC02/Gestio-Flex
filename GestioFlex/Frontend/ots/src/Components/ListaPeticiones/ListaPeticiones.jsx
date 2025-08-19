import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import TablePagination from '@mui/material/TablePagination';
import DataList from '../DataList/DataList';
import { useNavigate } from 'react-router-dom';

const ListaPeticiones = ({ apiUrl }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [selectedTecnicoId, setSelectedTecnicoId] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const token = sessionStorage.getItem('access');
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        let url = apiUrl;
        if (selectedTecnicoId) {
          url += `?tecnico_id=${selectedTecnicoId}`;
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Error al cargar pedidos');
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        enqueueSnackbar('Error al cargar pedidos', { variant: 'error' });
      }
    };

    fetchPedidos();
  }, [token, selectedTecnicoId, apiUrl, enqueueSnackbar]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });

  const handleViewDetails = (pedidoId) => navigate(`/detallebodega/${pedidoId}`);

  const pedidosPaginados = pedidos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className='boxInsumos'>
      <h2>Lista de Pedidos Validados</h2>
      <div className='filtroTecnico'>
        <label htmlFor="tecnico-select">Filtrar por Técnico: </label>
        <DataList
          apiUrl={`${API_URL}/usuario/api/tecnicos/`}
          keyField="id"
          valueField="username"
          renderOption={(item) => `${item.username}`}
          onSelect={setSelectedTecnicoId}
        />
      </div>

      <div className='card-container'>
        {pedidosPaginados.length > 0 ? (
          pedidosPaginados.map((pedido) => (
            <div key={pedido.id} className='pedido-card'>
              <div className='pedido-info'>
                <h3>Pedido #{pedido.id}</h3>
                <p><strong>Fecha:</strong> {formatDate(pedido.fecha_solicitud)}</p>
                <p><strong>Técnico:</strong> {pedido.tecnico}</p>
                <p><strong>Tipo:</strong> {pedido.tipo}</p>
                <p><strong>Subtipo:</strong> {pedido.subtipo}</p>
                <p><strong>OT:</strong> {pedido.ot || 'N/A'}</p>
                <p><strong>Proyecto:</strong> {pedido.proyecto ? pedido.proyecto : "No asignado"}</p>
              </div>
              <button onClick={() => handleViewDetails(pedido.id)}>
                Ver Detalles
              </button>
            </div>
          ))
        ) : (
          <p>No hay pedidos validados disponibles.</p>
        )}
      </div>

      <TablePagination
        component="div"
        count={pedidos.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Filas por página"
      />
    </div>
  );
};

export default ListaPeticiones;
