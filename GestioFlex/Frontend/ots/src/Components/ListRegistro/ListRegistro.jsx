import React, { useEffect, useState } from 'react';
import '../../Styles/Global.css';
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from 'react-router-dom';

const ListRegistro = ({ apiUrl }) => {
    const [pedidos, setPedidos] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const token = sessionStorage.getItem('access');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Error al cargar pedidos');
                const data = await response.json();
                setPedidos(data);
            } catch (error) {
                console.error('Error al cargar pedidos:', error);
            }
        };

        fetchPedidos();
    }, [apiUrl, token]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const handleRowClick = (pedidoId) => {
        navigate(`/pedido/detalle/${pedidoId}`);
    };

    const pedidosPaginados = pedidos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <div className='boxInsumos'>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Tecnico</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidosPaginados.map((pedido) => (
                        <tr
                            key={pedido.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleRowClick(pedido.id)}
                        >
                            <td data-label="ID">{pedido.id}</td>
                            <td data-label="Fecha">{formatDate(pedido.fecha_solicitud)}</td>
                            <td data-label="Tecnica">{pedido.tecnico}</td>
                            <td data-label="Tipo">{pedido.tipo}</td>
                            <td data-label="Estado">{pedido.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
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

export default ListRegistro;
