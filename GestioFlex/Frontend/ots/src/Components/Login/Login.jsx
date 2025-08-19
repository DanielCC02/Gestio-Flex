import './Login.css';
import React, { useState } from 'react';
import { useSession } from '../../Context/sessionContext';
import { useSnackbar } from 'notistack';
import Footer from '../Footer/Footer';
import Spinner from '../Spinner/Spinner';

const Login = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { setIsLoggedIn, loadSession } = useSession();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!username.trim() || !password.trim()) {
            enqueueSnackbar('Usuario y/o contraseña no pueden estar vacíos', { variant: 'warning', autoHideDuration: 1500 });
            setIsLoading(false);
            return;
        }
        if (username.length < 3 || password.length < 6) {
            enqueueSnackbar('Usuario o contraseña inválidos. Revisa los campos.', { variant: 'warning', autoHideDuration: 1500 });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/usuario/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('refresh', data.refresh);
                sessionStorage.setItem('access', data.access);
                sessionStorage.setItem('rol', data.rol);
                sessionStorage.setItem('idUser', data.id);

                setIsLoggedIn(true);
                loadSession();
            } else if (response.status === 401) {
                enqueueSnackbar('Credenciales incorrectas', { variant: 'error', autoHideDuration: 1500 });
            } else {
                enqueueSnackbar('Error al iniciar sesión', { variant: 'error', autoHideDuration: 1500 });
            }
        } catch (error) {
            enqueueSnackbar('Error de conexión al iniciar sesión', { variant: 'error', autoHideDuration: 2000 });
            setError('Error de conexión al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && <Spinner />}
            <div className='login-box-container'>
                <div className="login-container">
                    <h2 className='login-title-text'>GestioFlex</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form className='formulario' onSubmit={handleLogin}>
                        <div className='input-box'>
                            <label className='input-title'>Usuario</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Ingrese su usuario"
                                value={username}
                                autoComplete="username"
                                required
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className='input-box'>
                            <label className='input-title'>Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Ingrese su contraseña"
                                value={password}
                                autoComplete="current-password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="remember-me">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            <label htmlFor="remember">Recordarme</label>
                        </div>
                        <button className='btnLogin' type="submit" disabled={isLoading}>
                            {isLoading ? 'Cargando...' : 'Ingresar'}
                        </button>
                    </form>
                </div>
             
            </div>
        </>
    );
};

export default Login;
