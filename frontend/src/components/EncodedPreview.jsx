import React, { useState } from 'react';

const PREVIEW_LENGTH = 240;

function EncodedPreview({ encodedBits }) {
  const [showFull, setShowFull] = useState(false);

  if (encodedBits === null || encodedBits === undefined) return null;

  const isLong = encodedBits.length > PREVIEW_LENGTH;
  const displayText =
    showFull || !isLong ? encodedBits : `${encodedBits.slice(0, PREVIEW_LENGTH)}…`;

  return (
    <section className="panel">
      <h2 className="panel__title">Flujo de bits transmitido</h2>
      <div className="terminal">
        <div className="terminal__bar">
          <span className="terminal__dot" />
          <span className="terminal__dot" />
          <span className="terminal__dot" />
          <span className="terminal__label">salida_codificada.bin</span>
        </div>
        <pre className="terminal__body">{displayText || '(vacío)'}</pre>
      </div>

      {isLong && (
        <button
          type="button"
          className="btn btn-link"
          onClick={() => setShowFull((prev) => !prev)}
        >
          {showFull ? 'Mostrar menos' : `Mostrar flujo completo (${encodedBits.length} bits)`}
        </button>
      )}
    </section>
  );
}

export default EncodedPreview;
