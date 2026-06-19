import React from 'react';

function AlgorithmSelector({ algorithm, onAlgorithmChange }) {
  return (
    <section className="panel">
      <div className="panel__eyebrow">Etapa 2 · Codificador</div>
      <h2 className="panel__title">Selección de algoritmo</h2>

      <div className="algorithm-options" role="radiogroup" aria-label="Algoritmo de compresión">
        <label className={`algorithm-option ${algorithm === 'huffman' ? 'is-selected' : ''}`}>
          <input
            type="radio"
            name="algorithm"
            value="huffman"
            checked={algorithm === 'huffman'}
            onChange={(event) => onAlgorithmChange(event.target.value)}
          />
          <span className="algorithm-option__name">Huffman</span>
          <span className="algorithm-option__desc">
            Árbol binario construido de abajo hacia arriba combinando los dos símbolos
            de menor frecuencia.
          </span>
        </label>

        <label className={`algorithm-option ${algorithm === 'shannon-fano' ? 'is-selected' : ''}`}>
          <input
            type="radio"
            name="algorithm"
            value="shannon-fano"
            checked={algorithm === 'shannon-fano'}
            onChange={(event) => onAlgorithmChange(event.target.value)}
          />
          <span className="algorithm-option__name">Shannon-Fano</span>
          <span className="algorithm-option__desc">
            División recursiva de arriba hacia abajo de la lista de símbolos ordenada
            por frecuencia.
          </span>
        </label>
      </div>
    </section>
  );
}

export default AlgorithmSelector;
