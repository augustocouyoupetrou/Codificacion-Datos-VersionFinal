import React from 'react';
import { Bar } from 'react-chartjs-2';
import '../utils/chartSetup';
import { formatCharShort } from '../utils/formatChar';

function FrequencyChart({ resultsTable }) {
  if (!resultsTable || resultsTable.length === 0) return null;

  const data = {
    labels: resultsTable.map((row) => formatCharShort(row.char)),
    datasets: [
      {
        label: 'Frecuencia',
        data: resultsTable.map((row) => row.freq),
        backgroundColor: 'rgba(37, 65, 178, 0.75)',
        borderColor: 'rgba(37, 65, 178, 1)',
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
      title: { display: true, text: 'Frecuencia de cada símbolo' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
        title: { display: true, text: 'Apariciones' },
      },
      x: {
        title: { display: true, text: 'Símbolo' },
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

export default FrequencyChart;
