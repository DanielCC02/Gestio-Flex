import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../Components/Navbar/Navbar';
import { useSnackbar } from 'notistack';
import '../../../Styles/Global.css';

const DetalleServicio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const [servicio, setServicio] = useState({
        nombre: '',
        descripcion: '',
        fecha_creacion: '',
        ultima_actualizacion: '',
    });

    useEffect(() => {
        const fetchServicio = async () => {
            const token = sessionStorage.getItem('access');
            try {
                const response = await fetch(`${API_URL}/servicio/servicios/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Error al cargar servicio');
                const data = await response.json();
                setServicio(data);
            } catch (error) {
                enqueueSnackbar('Error al cargar servicio', { variant: 'error' });
            }
        };

        fetchServicio();
    }, [API_URL, id, enqueueSnackbar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServicio((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('access');
        try {
            const response = await fetch(`${API_URL}/servicio/servicios/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(servicio),
            });

            if (!response.ok) throw new Error('Error al actualizar servicio');
            enqueueSnackbar('Servicio actualizado exitosamente', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Error al actualizar servicio', { variant: 'error' });
        }
    };

    return (
        <>
            <Navbar />
            <main style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: 'calc(100vh - 100px)', 
                backgroundColor: '#f0f2f5', 
                padding: '20px' 
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '600px',
                    backgroundColor: '#fff',
                    padding: '30px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <h2 style={{ marginBottom: '25px', color: '#333' }}>Detalle de Servicio</h2>
                    <form onSubmit={handleUpdate}>
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ fontWeight: '500' }}>Nombre:</label>
                            <input
                                type="text"
                                name="nombre"
                                value={servicio.nombre}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    marginTop: '5px',
                                    fontSize: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ fontWeight: '500' }}>Descripción:</label>
                            <input
                                type="text"
                                name="descripcion"
                                value={servicio.descripcion}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    marginTop: '5px',
                                    fontSize: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc'
                                }}
                            />
                        </div>

                        <div style={{ marginTop: '15px', color: '#555' }}>
                            <p><strong>Fecha de creación:</strong> {new Date(servicio.fecha_creacion).toLocaleString()}</p>
                            <p><strong>Última actualización:</strong> {new Date(servicio.ultima_actualizacion).toLocaleString()}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', marginTop: '25px', justifyContent: 'center' }}>
                            <button type="submit" style={{
                                padding: '10px 25px',
                                fontSize: '1.1rem',
                                fontWeight: '500',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                backgroundColor: '#6CB4EE',
                                color: '#fff',
                                transition: '0.3s'
                            }}>Guardar Cambios</button>

                            <button type="button" onClick={() => navigate('/servicios')} style={{
                                padding: '10px 25px',
                                fontSize: '1.1rem',
                                fontWeight: '500',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                backgroundColor: '#aaa',
                                color: '#fff',
                                transition: '0.3s'
                            }}>Volver</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default DetalleServicio;
