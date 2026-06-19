import React from 'react';

function DecodedPanel({ decodedText, originalText }) {
  if (decodedText === null || decodedText === undefined) return null;

  const isMatch = decodedText === originalText;

  return (
    <section className="panel">
      <div className="panel__eyebrow">Etapa 4 · Decodificador</div>
      <h2 className="panel__title">Texto descomprimido</h2>

      <div className="decoded-box">{decodedText || '(vacío)'}</div>

      <p className={isMatch ? 'verification verification--ok' : 'verification verification--fail'}>
        {isMatch
          ? 'La descompresión es exacta: el texto reconstruido coincide con el original (compresión sin pérdida).'
          : 'El texto descomprimido NO coincide con el original.'}
      </p>
    </section>
  );
}

export default DecodedPanel;
