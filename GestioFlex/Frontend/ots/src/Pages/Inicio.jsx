import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import "../Styles/Global.css";
import Logo from '../Assets/logo.png';

const Inicio = () => {
  return (
    <div className="inicio-page">
      <Navbar />

      {/* Hero */}
      <header className="hero">
        <div className="inicio-container">                      
          <h1>Bienvenido a GestioFlex</h1>
          <p>Optimiza y gestiona tus recursos de manera eficiente.</p>
        </div>
      </header>

      {/* Misión y Visión */}
      <main className="contenido">
        <div className="tarjeta">
          <h2>Nuestra Misión</h2>
          <p>
            Brindar a las empresas herramientas digitales innovadoras que
            permitan gestionar de forma ágil y segura sus procesos de inventario,
            insumos y servicios, asegurando la eficiencia y confiabilidad en la
            toma de decisiones.
          </p>
        </div>

        <div className="tarjeta">
          <h2>Nuestra Visión</h2>
          <p>
            Convertirnos en la plataforma líder en gestión de recursos,
            destacando por la innovación tecnológica, la facilidad de uso y el
            impacto positivo en la productividad de nuestros clientes.
          </p>
        </div>
      </main>

      
    </div>
  );
};

export default Inicio;
