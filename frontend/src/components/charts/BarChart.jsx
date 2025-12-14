import React from 'react';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

export default function BarChart({ labels = [], datasets = [], options = {} }) {
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
      <Bar data={data} options={opts} />
    </div>
  );
}
