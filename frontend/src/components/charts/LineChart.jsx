import React from 'react';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';

export default function LineChart({ labels = [], datasets = [], options = {} }) {
  const data = { labels, datasets };
  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: { x: { ticks: { maxRotation: 0 } }, y: { beginAtZero: true } },
    ...options,
  };

  return (
    <div className="w-full h-64">
      <Line data={data} options={opts} />
    </div>
  );
}
