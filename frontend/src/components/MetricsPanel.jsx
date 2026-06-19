import React from 'react';

function MetricsPanel({ metrics }) {
  if (!metrics) return null;

  return (
    <section className="panel">
      <div className="panel__eyebrow">Etapa 3 · Resultados</div>
      <h2 className="panel__title">Métricas de compresión</h2>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-card__label">Tamaño original</span>
          <span className="metric-card__value">
            {metrics.originalSizeBits.toLocaleString('es-AR')} bits
          </span>
          <span className="metric-card__hint">
            ({metrics.originalSizeBytes.toLocaleString('es-AR')} bytes UTF-8)
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-card__label">Tamaño codificado</span>
          <span className="metric-card__value">
            {metrics.encodedSizeBits.toLocaleString('es-AR')} bits
          </span>
          <span className="metric-card__hint">
            ({metrics.encodedSizeBytes.toFixed(2)} bytes)
          </span>
        </div>

        <div className="metric-card metric-card--accent">
          <span className="metric-card__label">Porcentaje de compresión</span>
          <span className="metric-card__value">
            {metrics.compressionPercentage.toFixed(2)}%
          </span>
          <span className="metric-card__hint">reducción respecto al original</span>
        </div>

        <div className="metric-card">
          <span className="metric-card__label">Cantidad de símbolos</span>
          <span className="metric-card__value">{metrics.symbolCount}</span>
          <span className="metric-card__hint">símbolos distintos</span>
        </div>
      </div>
    </section>
  );
}

export default MetricsPanel;
