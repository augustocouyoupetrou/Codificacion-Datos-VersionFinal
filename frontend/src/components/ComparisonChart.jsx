import React from 'react';
import { Bar } from 'react-chartjs-2';
import '../utils/chartSetup';

function ComparisonChart({ metrics }) {
  if (!metrics) return null;

  const data = {
    labels: ['Tamaño original', 'Tamaño comprimido'],
    datasets: [
      {
        label: 'Bits',
        data: [metrics.originalSizeBits, metrics.encodedSizeBits],
        backgroundColor: ['rgba(209, 67, 67, 0.75)', 'rgba(0, 184, 169, 0.75)'],
        borderColor: ['rgba(209, 67, 67, 1)', 'rgba(0, 184, 169, 1)'],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Comparación de tamaño (bits)' },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Bits' },
      },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-card__canvas">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default ComparisonChart;
