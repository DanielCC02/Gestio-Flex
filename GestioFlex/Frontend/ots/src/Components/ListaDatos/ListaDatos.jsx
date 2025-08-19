// ListaDatos.jsx

import React, { useEffect, useState } from 'react';
import './ListaDatos.css';

const ListaDatos = () => {
    const [pedidos, setPedidos] = useState([]);

    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const token = sessionStorage.getItem('access');

    // Cargar pedidos no validados del usuario autenticado
    useEffect(() => {
        fetch(`${API_URL}/pedido/api/realizados_pendientes/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar pedidos');
                return response.json();
            })
            .then(data => {
                setPedidos(data);
            })
            .catch(error => console.error(error));
    }, [API_URL, token]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const formatValidado = (validado) => {
        return validado ? 'Sí' : 'No';
    };

    return (
        <div className='boxPedidos'>
            <h2>Lista de Pedidos No Validados</h2>
            <table className='tablaPedidos' border="1" cellPadding="5">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Insumos</th>
                        <th>Estado</th>
                        <th>Validado</th>
                        <th>Tipo</th>
                        <th>Nota</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map(pedido => (
                        <tr key={pedido.id}>
                            <td>{formatDate(pedido.fecha_solicitud)}</td>
                            <td>
                                <ul>
                                    {pedido.insumos.map((insumoData, index) => (
                                        <li key={`${pedido.id}-${index}`}>
                                            {insumoData.insumo.nombre} - Solicitado: {insumoData.insumo.solicitado}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>{pedido.estado}</td>
                            <td>{formatValidado(pedido.validado)}</td>
                            <td>{pedido.tipo}</td>
                            <td>{pedido.nota || "Sin nota"}</td> {/* Mostrar nota o mensaje si está vacía */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaDatos;
