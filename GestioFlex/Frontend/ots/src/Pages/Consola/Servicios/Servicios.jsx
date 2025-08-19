import React, { useState, useEffect } from 'react';
import Navbar from '../../../Components/Navbar/Navbar';
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import '../../../Styles/Global.css';

const Servicios = () => {
    const { enqueueSnackbar } = useSnackbar();
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [servicios, setServicios] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchNombre, setSearchNombre] = useState('');

    const fetchServicios = async (filters = {}) => {
        const token = sessionStorage.getItem('access');
        if (!token) {
            enqueueSnackbar("No hay token de sesión. Inicia sesión primero.", { variant: "warning" });
            setError("No autenticado");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.nombre) queryParams.append('nombre', filters.nombre);

            const response = await fetch(`${API_URL}/servicio/servicios/?${queryParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || "Error al cargar servicios");
                } else {
                    throw new Error(`Error ${response.status}: Respuesta no es JSON`);
                }
            }

            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("La API no devolvió JSON. ¿Estás autenticado?");
            }

            const data = await response.json();
            setServicios(data);
        } catch (err) {
            setError(err.message);
            enqueueSnackbar(err.message, { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServicios();
    }, [API_URL]);

    const handleCreateClick = () => navigate('/servicios/crear');
    const handleViewDetails = (id) => navigate(`/servicios/detalle/${id}`);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleBuscar = () => fetchServicios({ nombre: searchNombre });
    const handleReset = () => {
        setSearchNombre('');
        fetchServicios();
    };

    const serviciosPaginados = servicios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    if (loading) return <p>Cargando servicios...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <>
            <Navbar />
            <main style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
                <h1 style={{ marginBottom: '30px', color: '#333' }}>Gestión de Servicios</h1>

                {/* Botón Crear alineado */}
                <div className="acciones-servicios">
                    <button className="btn-create" onClick={handleCreateClick}>
                        + Crear Servicio
                    </button>
                </div>

                {/* Buscador por Nombre */}
                <div className="buscador-bonito" style={{ display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '30px' }}>
                    <input
                        type="text"
                        placeholder="Buscar por nombre"
                        value={searchNombre}
                        onChange={(e) => setSearchNombre(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', flex: '1' }}
                    />
                    <button onClick={handleBuscar} style={{ padding: '8px 12px', borderRadius: '5px', backgroundColor: '#6CB4EE', color: '#fff', border: 'none', cursor: 'pointer' }}>
                        Buscar
                    </button>
                    <button onClick={handleReset} style={{ padding: '8px 12px', borderRadius: '5px', backgroundColor: '#ccc', color: '#000', border: 'none', cursor: 'pointer' }}>
                        Ver todos
                    </button>
                </div>

                {/* Tabla moderna */}
                <div className="tabla-bonita" style={{ width: '100%', maxWidth: '900px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <thead style={{ backgroundColor: '#5AADE8', color: '#fff' }}>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serviciosPaginados.map((servicio) => (
                                <tr key={servicio.id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td data-label="ID" style={{ textAlign: 'center', padding: '8px' }}>{servicio.id}</td>
                                    <td data-label="Nombre" style={{ textAlign: 'center', padding: '8px' }}>{servicio.nombre}</td>
                                    <td data-label="Descripción" style={{ textAlign: 'center', padding: '8px' }}>{servicio.descripcion}</td>
                                    <td data-label="Acciones" style={{ textAlign: 'center', padding: '8px' }}>
                                        <button onClick={() => handleViewDetails(servicio.id)} style={{ padding: '6px 12px', borderRadius: '5px', backgroundColor: '#6CB4EE', color: '#fff', border: 'none', cursor: 'pointer' }}>
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <TablePagination
                        component="div"
                        count={servicios.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página"
                    />
                </div>
            </main>
        </>
    );
};

export default Servicios;
