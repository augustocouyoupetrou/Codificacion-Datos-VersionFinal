import React, { useState } from 'react';

import Header from './components/Header';
import InputPanel from './components/InputPanel';
import AlgorithmSelector from './components/AlgorithmSelector';
import ActionButtons from './components/ActionButtons';
import MetricsPanel from './components/MetricsPanel';
import FrequencyTable from './components/FrequencyTable';
import FrequencyChart from './components/FrequencyChart';
import ComparisonChart from './components/ComparisonChart';
import EncodedPreview from './components/EncodedPreview';
import DecodedPanel from './components/DecodedPanel';

import { compressText, decompressText } from './services/compressionApi';

import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [algorithm, setAlgorithm] = useState('huffman'); // 'huffman' | 'shannon-fano'
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  // Resultado de la última compresión, recibido tal cual del backend:
  // { encodedBits, codes, freqTable, tree, metrics, resultsTable }
  const [compressionData, setCompressionData] = useState(null);
  const [decodedText, setDecodedText] = useState(null);

  const resetDownstreamState = () => {
    setCompressionData(null);
    setDecodedText(null);
  };

  const handleTextChange = (text) => {
    setInputText(text);
    setError('');
    resetDownstreamState();
  };

  const handleFileLoaded = ({ content, name, error: fileError }) => {
    if (fileError) {
      setError(fileError);
      return;
    }
    setInputText(content);
    setFileName(name);
    setError('');
    resetDownstreamState();
  };

  const handleAlgorithmChange = (value) => {
    setAlgorithm(value);
    resetDownstreamState();
  };

  const handleCompress = async () => {
    if (!inputText || inputText.length === 0) {
      setError('Ingrese texto manualmente o cargue un archivo .txt antes de comprimir.');
      return;
    }
    setError('');

    try {
      // El backend ejecuta el algoritmo, calcula las métricas y arma la
      // tabla de resultados; el frontend solo guarda lo que recibe.
      const result = await compressText({ text: inputText, algorithm });
      setCompressionData(result);
      setDecodedText(null);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al comprimir el texto.');
    }
  };

  const handleDecompress = async () => {
    if (!compressionData) {
      setError('Primero debe comprimir el texto para poder descomprimirlo.');
      return;
    }
    setError('');

    try {
      const { decodedText: result } = await decompressText({
        algorithm,
        encodedBits: compressionData.encodedBits,
        codes: compressionData.codes,
        tree: compressionData.tree,
      });
      setDecodedText(result);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al descomprimir el texto.');
    }
  };

  return (
    <div className="app-shell">
      <Header />

      <main className="app-container">
        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        <InputPanel
          inputText={inputText}
          onTextChange={handleTextChange}
          onFileLoaded={handleFileLoaded}
          fileName={fileName}
        />

        <AlgorithmSelector algorithm={algorithm} onAlgorithmChange={handleAlgorithmChange} />

        <ActionButtons
          onCompress={handleCompress}
          onDecompress={handleDecompress}
          canDecompress={!!compressionData}
        />

        {compressionData && (
          <>
            <MetricsPanel metrics={compressionData.metrics} />
            <FrequencyTable resultsTable={compressionData.resultsTable} />

            <section className="panel">
              <h2 className="panel__title">Visualización</h2>
              <div className="charts-grid">
                <FrequencyChart resultsTable={compressionData.resultsTable} />
                <ComparisonChart metrics={compressionData.metrics} />
              </div>
            </section>

            <EncodedPreview encodedBits={compressionData.encodedBits} />
          </>
        )}

        <DecodedPanel decodedText={decodedText} originalText={inputText} />
      </main>

      <footer className="app-footer">
        Trabajo Práctico — Comunicación de Datos · Codificación de Datos (Huffman / Shannon-Fano)
      </footer>
    </div>
  );
}

export default App;
