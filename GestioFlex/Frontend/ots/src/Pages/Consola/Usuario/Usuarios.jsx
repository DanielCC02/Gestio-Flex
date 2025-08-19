import React, { useState, useEffect } from 'react';
import '../../../Styles/Global.css';
import Navbar from '../../../Components/Navbar/Navbar';
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Usuarios = () => {
    const { enqueueSnackbar } = useSnackbar();
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    // Estados para usuarios y usuario seleccionado
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Paginación
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Fetch inicial de usuarios
    useEffect(() => {
        const fetchUsuarios = async () => {
            const token = sessionStorage.getItem('access');
            try {
                const response = await fetch(`${API_URL}/usuario/api/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Error al cargar usuarios');
                }
                const data = await response.json();
                setUsuarios(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsuarios();
    }, [API_URL]);

    // Manejar clic en usuario
    const handleUserClick = (id) => {
        navigate(`/usuario/detalle/${id}`);
    };

    // Manejar creación de usuario
    const handleCreateUser = () => {
        navigate(`/usuario/crear`);
    };

    // Manejar eliminación de usuario
    const handleDeleteUser = async (id) => {
        const token = sessionStorage.getItem('access');
        try {
            const response = await fetch(`${API_URL}/usuario/api/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }
            setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id !== id));
            enqueueSnackbar('Usuario eliminado correctamente', { variant: 'success' });
        } catch (err) {
            enqueueSnackbar('Error al eliminar usuario', { variant: 'error' });
        }
    };

    // Manejo de paginación
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Usuarios paginados
    const usuariosPaginados = usuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    if (loading) return <p>Cargando usuarios...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <Navbar />
            <main>
                <div className="contenido">
                    <h1>Gestión de Usuarios</h1>
                    <button className="btn-create" onClick={handleCreateUser}>
                        Crear Usuario
                    </button>
                    <div className="boxInsumos">
                        <table border="1" cellPadding="5" className="user-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosPaginados.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.id}</td>
                                        <td>{usuario.username}</td>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.rol}</td>
                                        <td>
                                            <button onClick={() => handleUserClick(usuario.id)}>Ver</button>
                                            <button onClick={() => handleDeleteUser(usuario.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <TablePagination
                            component="div"
                            count={usuarios.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Filas por página"
                        />
                    </div>
                </div>
            </main>
        </>
    );
};

export default Usuarios;
