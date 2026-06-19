import React from 'react';
import { formatCharLabel } from '../utils/formatChar';

function FrequencyTable({ resultsTable }) {
  if (!resultsTable || resultsTable.length === 0) return null;

  return (
    <section className="panel">
      <h2 className="panel__title">Tabla de frecuencias y códigos</h2>

      <div className="table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th>Símbolo</th>
              <th>Frecuencia</th>
              <th>Probabilidad</th>
              <th>Código generado</th>
              <th>Longitud (bits)</th>
            </tr>
          </thead>
          <tbody>
            {resultsTable.map((row) => (
              <tr key={row.char}>
                <td>{formatCharLabel(row.char)}</td>
                <td>{row.freq}</td>
                <td>{(row.probability * 100).toFixed(2)}%</td>
                <td className="code-cell">{row.code}</td>
                <td>{row.codeLength}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default FrequencyTable;
