import React, { useState } from 'react';
import Navbar from '../../../Components/Navbar/Navbar';
import { useSnackbar } from 'notistack';

const ROLES = [
    { value: 'admin', label: 'Administrador' },
    { value: 'jefatura', label: 'Jefatura' },
    { value: 'empleado', label: 'Empleado' },
];

const CrearUsuario = () => {
    const { enqueueSnackbar } = useSnackbar();
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const [usuario, setUsuario] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        rol: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = sessionStorage.getItem('access');
        const url = `${API_URL}/usuario/api/`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(usuario),
                credentials: 'include',
                mode: 'cors',
            });

            if (!response.ok) {
                const errorData = await response.json();
                enqueueSnackbar('Error al crear usuario', { variant: 'error', autoHideDuration: 1500 });
                console.error('Error en la solicitud:', errorData);
                return;
            }

            enqueueSnackbar('Usuario creado exitosamente', { variant: 'success' });
            setUsuario({
                username: '',
                password: '',
                email: '',
                first_name: '',
                last_name: '',
                rol: '',
            });
        } catch (error) {
            enqueueSnackbar('Error al crear usuario', { variant: 'error', autoHideDuration: 1500 });
            console.error('Error en la solicitud:', error);
        }
    };

    return (
        <>
            <Navbar />
            <main>
                <div className="title">
                    <h1>CREAR USUARIO</h1>
                </div>
                <div className="contenido">
                    <form className='userForm' onSubmit={handleSubmit}>
                        <div className='formBox'>
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={usuario.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='formBox'>
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={usuario.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='formBox'>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={usuario.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='formBox'>
                            <label>First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={usuario.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='formBox'>
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={usuario.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='formBox'>
                            <label>Rol</label>
                            <select
                                name="rol"
                                value={usuario.rol}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione un rol</option>
                                {ROLES.map((role) => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className='btnUserForm' type="submit">Crear Usuario</button>
                        <button 
    type="button" 
    className='btnUserForm' 
    onClick={() => window.history.back()}
>
    Volver
</button>
                        
                    </form>
                    
                </div>
            </main>
        </>
    );
};

export default CrearUsuario;
