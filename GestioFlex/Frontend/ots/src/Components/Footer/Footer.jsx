// src/Component/Footer.jsx
import React from "react";

const Footer = () => {
    return (
        <footer style={footerStyle}>
            <div style={contentWrapperStyle}>
                <p>&copy; 2024 Distribuidora LARCE S.A.</p>
                <ul style={ulStyle}>
                    <li><a href="#home" style={linkStyle}><i className="fa-solid fa-house"></i> Inicio</a></li>
                    <li><a href="#about" style={linkStyle}>Acerca de</a></li>
                    <li><a href="#contact" style={linkStyle}>Contacto</a></li>
                    <li><a href="#privacy" style={linkStyle}>Política de Privacidad</a></li>
                    <li><a href="#terms" style={linkStyle}>Términos y Condiciones</a></li>
                </ul>
            </div>
        </footer>
    );
};

// Estilos ajustables para el pie de página
const footerStyle = {
    height: "120px", // Puedes modificar la altura aquí
    width: "100%",
    backgroundColor: "#333",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const contentWrapperStyle = {
    textAlign: "center",
    maxWidth: "1200px", // Puedes ajustar el contenido para que no se expanda más allá de este ancho
    margin: "0 auto",
};

const ulStyle = {
    listStyle: "none",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    padding: 0,
    margin: "10px 0 0 0",
};

const linkStyle = {
    color: "white",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "5px",
};

export default Footer;