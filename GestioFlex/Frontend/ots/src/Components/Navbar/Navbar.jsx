import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../Context/sessionContext';
import Logo from '../../Assets/logo.png';

const Navbar = () => {
  const { setIsLoggedIn } = useSession(); // rol no hace falta aquí
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
    window.location.reload();
  };

  /* ───────────── MENÚ RESPONSIVE ───────────── */
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="Navbar">
      <div className={`Navbar-logo ${menuOpen ? 'hidden' : ''}`}>
        <img src={Logo} alt="Logo Gesto-Flex" className="logo" />
      </div>

      <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        {menuOpen ? 'X' : '☰'}
      </div>

      <ul className={`Navbar-list ${menuOpen ? 'open' : ''}`}>
        <li><a className="link" href="/inicio" onClick={closeMenu}>Inicio</a></li> {/* Todos ven Inicio */}
        <li><a className="link" href="/consola" onClick={closeMenu}>Consola</a></li> {/* Todos ven Consola */}
        <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
      </ul>
    </div>
  );
};

export default Navbar;
