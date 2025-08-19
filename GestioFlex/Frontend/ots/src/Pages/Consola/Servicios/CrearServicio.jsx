import React, { useState } from 'react';
import Navbar from '../../../Components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import '../../../Styles/Global.css';

const CrearServicio = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const [servicio, setServicio] = useState({
        nombre: '',
        descripcion: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServicio((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('access');
        try {
            const response = await fetch(`${API_URL}/servicio/servicios/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(servicio),
            });

            if (!response.ok) throw new Error('Error al crear servicio');

            enqueueSnackbar('Servicio creado exitosamente', { variant: 'success' });
            setServicio({ nombre: '', descripcion: '' });
        } catch (error) {
            enqueueSnackbar('Error al crear servicio', { variant: 'error' });
        }
    };

    return (
        <>
            <Navbar />
            <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
                <div style={{ width: '90%', maxWidth: '500px', textAlign: 'center', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '10px', backgroundColor: '#fff' }}>
                    <h1>CREAR SERVICIO</h1>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                        <div>
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={servicio.nombre}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div>
                            <label>Descripción</label>
                            <input
                                type="text"
                                name="descripcion"
                                value={servicio.descripcion}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}>
                                Crear Servicio
                            </button>
                            <button type="button" onClick={() => navigate('/servicios')} style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#ccc', color: '#000', border: 'none', cursor: 'pointer' }}>
                                Volver
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default CrearServicio;
