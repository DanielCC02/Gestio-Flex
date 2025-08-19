import React from 'react';
import styles from './Sidenavbar.module.css';
// Puedes instalar react-icons si lo deseas: npm install react-icons
import { FaHome } from 'react-icons/fa';

const Sidenavbar = () => {
  return (
    <div className={styles.sidenavbar}>
      {/* Sección superior con el logo */}
      <div className={styles.top}>
        <h1>LOGO</h1>
      </div>

      {/* Sección central con la opción de link (icono y nombre) */}
      <div className={styles.body}>
        <a href="/ruta-del-link" className={styles.navLink}>
          <FaHome className={styles.icon} />
          <span>Inicio</span>
        </a>
      </div>

      {/* Sección inferior con foto de usuario, nombre y correo */}
      <div className={styles.bottom}>
        <img 
          src="https://via.placeholder.com/40" 
          alt="Foto de usuario" 
          className={styles.userPhoto} 
        />
        <div className={styles.userInfo}>
          <span className={styles.userName}>Nombre de Usuario</span>
          <span className={styles.userEmail}>usuario@example.com</span>
        </div>
      </div>
    </div>
  );
};

export default Sidenavbar;
