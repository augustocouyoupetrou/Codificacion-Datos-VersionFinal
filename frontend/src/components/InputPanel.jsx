import React, { useRef } from 'react';

/**
 * Panel de entrada de datos.
 * Permite escribir texto manualmente o cargar un archivo .txt mediante
 * la FileReader API del navegador.
 */
function InputPanel({ inputText, onTextChange, onFileLoaded, fileName }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.txt')) {
      onFileLoaded({ error: 'Por favor seleccione un archivo con extensión .txt' });
      event.target.value = '';
      return;
    }

    // --- Uso de la FileReader API ---
    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const content = loadEvent.target.result;
      onFileLoaded({ content, name: file.name });
    };

    reader.onerror = () => {
      onFileLoaded({ error: 'Ocurrió un error al leer el archivo seleccionado.' });
    };

    reader.readAsText(file, 'UTF-8');
    // Se limpia el input para permitir volver a cargar el mismo archivo si se desea.
    event.target.value = '';
  };

  return (
    <section className="panel">
      <div className="panel__eyebrow">Etapa 1 · Fuente</div>
      <h2 className="panel__title">Entrada de datos</h2>

      <textarea
        className="text-area"
        placeholder="Escriba o pegue aquí el texto a comprimir..."
        value={inputText}
        onChange={(event) => onTextChange(event.target.value)}
        rows={8}
        aria-label="Texto de entrada"
      />

      <div className="input-actions">
        <button type="button" className="btn btn-secondary" onClick={handleButtonClick}>
          Cargar archivo .txt
        </button>
        <input
          type="file"
          accept=".txt,text/plain"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {fileName && <span className="file-chip">Archivo cargado: {fileName}</span>}
        <span className="char-count">{inputText.length} caracteres</span>
      </div>
    </section>
  );
}

export default InputPanel;
