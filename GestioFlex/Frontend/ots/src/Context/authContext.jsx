import React, { createContext, useState, useContext } from 'react';

// Crea el contexto
const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access') || null);
  const [sessionExpired, setSessionExpired] = useState(false);
  
  // Función para reactivar la sesión
  const reactivarSesion = async () => {
    // Opcionalmente puedes llamar a un endpoint de refresh token aquí
    // o redirigir al usuario a la página de login.
    // Ejemplo: llamas a /auth/refresh, y si funciona, actualizas token y cierras modal.
    try {
      // Aquí llamaría a tu endpoint de refresh
      // const refreshedToken = await refreshToken();
      // setToken(refreshedToken);
      // localStorage.setItem('access', refreshedToken);
      setSessionExpired(false);
    } catch (error) {
      console.error('No se pudo reactivar la sesión', error);
      finalizarSesion();
    }
  };

  // Función para finalizar la sesión (logout)
  const finalizarSesion = () => {
    setToken(null);
    localStorage.removeItem('access');
    setSessionExpired(false);
    // Redirige al login u otra acción para cerrar sesión
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        sessionExpired,
        setSessionExpired,
        reactivarSesion,
        finalizarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto
export const useAuth = () => useContext(AuthContext);
