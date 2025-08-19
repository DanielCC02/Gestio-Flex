import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../Components/Navbar/Navbar';
import { useSnackbar } from 'notistack';

const ROLES = [
    { value: 'admin', label: 'Administrador' },   // Ve todo
    { value: 'jefatura', label: 'Jefatura' },     // Ve todo menos usuarios
    { value: 'empleado', label: 'Empleado' },     // Solo ve órdenes, no puede modificar ni crear
];



const UsuarioDetalle = () => {
    const { enqueueSnackbar } = useSnackbar();
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        rol: '',
    });
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUsuario = async () => {
            const token = sessionStorage.getItem('access');
            try {
                const response = await fetch(`${API_URL}/usuario/api/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Error al cargar usuario');
                const data = await response.json();
                setUsuario(data);
            } catch (error) {
                enqueueSnackbar('Error al cargar usuario', { variant: 'error', autoHideDuration: 2000 });
            } finally {
                setLoading(false);
            }
        };
        fetchUsuario();
    }, [API_URL, id, enqueueSnackbar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => setPassword(e.target.value);

    const rolActual = sessionStorage.getItem('rol'); // rol del usuario logueado
const handleUpdate = async () => {
    const token = sessionStorage.getItem('access');
    const updateData = {
        username: usuario.username,
        email: usuario.email,
        first_name: usuario.first_name,
        last_name: usuario.last_name,
    };

    // Solo admin puede cambiar rol
    if (rolActual === 'admin' && usuario.rol) {
        const allowedRoles = ['admin', 'empleado', 'jefatura']; // ✅ incluye jefatura
        if (allowedRoles.includes(usuario.rol)) {
            updateData.rol = usuario.rol;
        }
    }

    // Solo envía la contraseña si se proporcionó
    if (password) updateData.password = password;

    try {
        const response = await fetch(`${API_URL}/usuario/api/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) throw new Error('Error al actualizar usuario');

        const updatedUsuario = await response.json();
        setUsuario(updatedUsuario);
        enqueueSnackbar('Usuario actualizado correctamente', { variant: 'success', autoHideDuration: 2000 });
        setIsEditing(false);
        setPassword('');
    } catch (error) {
        enqueueSnackbar('Error al actualizar usuario', { variant: 'error', autoHideDuration: 2000 });
    }
};




    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando datos del usuario...</p>;

    return (
        <>
            <Navbar />
            <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
                <div style={{
                    width: '90%',
                    maxWidth: '500px',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                    backgroundColor: '#fff',
                    textAlign: 'center'
                }}>
                    <h1 style={{ marginBottom: '25px' }}>Detalles del Usuario</h1>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' }}>
                        <div>
                            <label style={{ fontWeight: 'bold' }}>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={usuario.username}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Username"
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '5px' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold' }}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={usuario.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Email"
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '5px' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold' }}>Nombre</label>
                            <input
                                type="text"
                                name="first_name"
                                value={usuario.first_name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Nombre"
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '5px' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold' }}>Apellido</label>
                            <input
                                type="text"
                                name="last_name"
                                value={usuario.last_name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Apellido"
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '5px' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold' }}>Rol</label>
                            <select
                                name="rol"
                                value={usuario.rol}
                                onChange={handleChange}
                                disabled={!isEditing}
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '5px' }}
                            >
                                {ROLES.map(role => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                        </div>
                        {isEditing && (
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="Nueva contraseña"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '5px' }}
                                />
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
                            {isEditing ? (
                                <button type="button" onClick={handleUpdate} style={{
                                    padding: '10px 20px',
                                    borderRadius: '6px',
                                    backgroundColor: '#1976d2',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}>
                                    Guardar Cambios
                                </button>
                            ) : (
                                <button type="button" onClick={() => setIsEditing(true)} style={{
                                    padding: '10px 20px',
                                    borderRadius: '6px',
                                    backgroundColor: '#1976d2',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}>
                                    Editar
                                </button>
                            )}
                            <button type="button" onClick={() => navigate('/usuarios')} style={{
                                padding: '10px 20px',
                                borderRadius: '6px',
                                backgroundColor: '#ccc',
                                color: '#000',
                                border: 'none',
                                cursor: 'pointer'
                            }}>
                                Volver
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default UsuarioDetalle;
