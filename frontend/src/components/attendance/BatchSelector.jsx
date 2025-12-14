import React from 'react';

export default function BatchSelector({ batches, value, onChange }) {
  return (
    <div className="w-full sm:w-72">
      <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
      >
        <option value="">Select batch</option>
        {batches.map((b) => (
          <option key={b._id || b.id} value={b._id || b.id}>
            {b.name || b.batchName || b.title}
          </option>
        ))}
      </select>
    </div>
  );
}
