import React from 'react';

function ActionButtons({ onCompress, onDecompress, canDecompress }) {
  return (
    <section className="panel action-panel">
      <button type="button" className="btn btn-primary" onClick={onCompress}>
        Comprimir
      </button>
      <button
        type="button"
        className="btn btn-primary btn-outline"
        onClick={onDecompress}
        disabled={!canDecompress}
        title={!canDecompress ? 'Primero debe comprimir el texto' : undefined}
      >
        Descomprimir
      </button>
    </section>
  );
}

export default ActionButtons;
