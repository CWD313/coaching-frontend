import React from 'react';

export default function DatePicker({ value, onChange }) {
  return (
    <div className="w-full sm:w-40">
      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
      />
    </div>
  );
}
