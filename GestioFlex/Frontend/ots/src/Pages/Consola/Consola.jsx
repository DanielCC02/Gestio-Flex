import { React } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import '../../Styles/Global.css';
import { useSession } from '../../Context/sessionContext';

const Consola = () => {
    const { rol } = useSession(); // obtenemos el rol del usuario

    const handleRedirect = (url) => {
        window.location.href = url;
    };

    return (
        <>
            <Navbar />
            <main>
                <div className='title'>
                    <h1>CONSOLA DE ADMINISTRACIÓN</h1>
                </div>
                <div className='contenido'>
                    <div className="contenido-title">
                        <hr />
                    </div>

                    <div className="contenido-title">
                        <h2>GESTIÓN</h2>
                        <hr />
                        <div className='gestorBox'>

                            {/* USUARIOS: solo Admin */}
                            {rol === 'admin' && (
                                <div className='gestorContent' onClick={() => handleRedirect('/usuarios')}>
                                    <svg className='icono' width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                        <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <h4>Usuarios</h4>
                                </div>
                            )}

                            {/* INSUMOS: Admin y Jefatura */}
                            {(rol === 'admin' || rol === 'jefatura') && (
                                <div className='gestorContent' onClick={() => handleRedirect('/insumos')}>
                                    <svg className='icono' width="800px" height="800px" viewBox="0 0 24 24">
                                        <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                                            <g transform="translate(-325.000000, -80.000000)">
                                                <g transform="translate(325.000000, 80.000000)">
                                                    <polygon fill="#FFFFFF" fillOpacity="0.01" points="24 0 0 0 0 24 24 24" />
                                                    <polygon points="22 7 12 2 2 7 2 17 12 22 22 17" stroke="#212121" strokeLinejoin="round" strokeWidth="1.5" />
                                                    <line stroke="#212121" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="2" x2="12" y1="7" y2="12" />
                                                    <line stroke="#212121" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="12" x2="12" y1="22" y2="12" />
                                                    <line stroke="#212121" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="22" x2="12" y1="7" y2="12" />
                                                    <line stroke="#212121" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="17" x2="7" y1="4.5" y2="9.5" />
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                    <h4>Insumos</h4>
                                </div>
                            )}

                            {/* SERVICIOS: Admin y Jefatura */}
                            {(rol === 'admin' || rol === 'jefatura') && (
                                <div className='gestorContent' onClick={() => handleRedirect('/servicios')}>
                                    <svg className='icono' xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 14 14">
                                        <g>
                                            <path d="M6.3,7l3.85,6L14,7Z" />
                                            <path d="M7,1V5h4V1Zm3,3H8V2h2Z" />
                                            <path d="M1,1V5H5V1ZM4,4H2V2H4Z" />
                                            <path d="M1,7v4H5V7Zm3,3H2V8H4Z" />
                                        </g>
                                    </svg>
                                    <h4>Servicios</h4>
                                </div>
                            )}

                            {/* ÓRDENES: todos los roles */}
                            <div className='gestorContent' onClick={() => handleRedirect('/ordenes')}>
                                <svg className='icono' xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 24 24">
                                    <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" />
                                </svg>
                                <h4>Órdenes</h4>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Consola;
