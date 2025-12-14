import React from 'react';

export default function StudentRow({ student, onToggle, saving }) {
  const { _id, firstName, lastName, mobileNumber, status } = student;

  const btnClass = (s) =>
    `px-3 py-1 rounded-md text-sm font-medium mr-2 ${status === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`;

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className="flex flex-col">
          <span className="font-medium">{firstName} {lastName}</span>
          <span className="text-sm text-gray-500">{mobileNumber}</span>
        </div>
      </div>

      <div className="flex items-center">
        <button
          onClick={() => onToggle(_id, 'present')}
          className={btnClass('present')}
          disabled={saving}
        >
          Present
        </button>

        <button
          onClick={() => onToggle(_id, 'absent')}
          className={btnClass('absent')}
          disabled={saving}
        >
          Absent
        </button>

        <button
          onClick={() => onToggle(_id, 'holiday')}
          className={btnClass('holiday')}
          disabled={saving}
        >
          Holiday
        </button>

        {saving && <div className="ml-3 text-xs text-gray-500">Saving...</div>}
      </div>
    </div>
  );
}
