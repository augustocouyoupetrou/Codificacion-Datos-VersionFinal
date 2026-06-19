import React from 'react';

function Header() {
  return (
    <header className="app-header">
      <div className="app-header__eyebrow">Comunicación de Datos · Trabajo Práctico</div>
      <h1 className="app-header__title">Codificación y Compresión de Datos</h1>
      <p className="app-header__subtitle">
        Algoritmos Huffman y Shannon-Fano — análisis de eficiencia de transmisión y almacenamiento
      </p>
    </header>
  );
}

export default Header;
