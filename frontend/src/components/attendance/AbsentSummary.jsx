import React from 'react';

export default function AbsentSummary({ absentList, totalAbsent }) {
  return (
    <div className="mt-4 p-3 bg-white rounded-md shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Absent Summary</h3>
        <div className="text-sm text-gray-600">Total Absent: <span className="font-medium">{totalAbsent}</span></div>
      </div>

      <div className="mt-2 text-sm text-gray-700">
        {absentList.length === 0 ? (
          <div>No absent students on this page.</div>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {absentList.map((s) => (
              <li key={s._id}>{s.firstName} {s.lastName} ({s.studentId || s._id})</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
