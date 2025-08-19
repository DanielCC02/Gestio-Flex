import React, { createContext, useState, useEffect, useContext } from 'react';

export const SessionContext = createContext();
export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
    const [enterprise, setEnterprise] = useState(null);
    const [rol, setRol] = useState(null);
    const [rolBodega, setRolBodega] = useState(null);
    const [bodegaId, setBodegaId] = useState(null);
    const [refresh, setRefresh] = useState(null);
    const [access, setAccess] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);  // Estado para la URL del PDF

    const [equipoUrl, setEquipoUrl] = useState('');

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const loadSession = () => {
        const enterprise = sessionStorage.getItem('enterprise');
        const userRol = sessionStorage.getItem('rol');
        const refresh = sessionStorage.getItem('refresh');
        const access = sessionStorage.getItem('access');
        const userId = sessionStorage.getItem('idUser');
        const rolBodegaSS = sessionStorage.getItem('rolbodega');
        const bodegaSS = sessionStorage.getItem('bodega');

        enterprise && setEnterprise(enterprise);
        userRol && setRol(userRol);
        refresh && setRefresh(refresh);
        access && setAccess(access);
        rolBodegaSS && setRolBodega(rolBodegaSS);
        bodegaSS && setBodegaId(bodegaSS);

        if (enterprise) {
            setEnterprise(enterprise);
        }

        if (userRol) {
            setRol(userRol);
        }

        if (refresh) {
            setRefresh(refresh);
        }

        if (access) {
            setAccess(access);
        }

        if (userId) {
            setEquipoUrl(`${API_URL}/equipos/user/${userId}/`);
            setIsLoggedIn(!!(refresh && access && userRol));
        }

    };

    useEffect(() => {
        loadSession();
    }, []);
    
    return (
        <SessionContext.Provider
            value={{
                enterprise,
                rol, setRol,
                rolBodega,          
                bodegaId,         
                refresh,
                access,
                isLoggedIn, setIsLoggedIn,
                loadSession,
                pdfUrl, setPdfUrl,
                equipoUrl
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};



export default SessionProvider;
