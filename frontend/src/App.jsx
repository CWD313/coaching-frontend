import React from 'react';
import AttendancePanel from './components/attendance/AttendancePanel';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold">Coaching Admin</h1>
        </div>
      </header>

      <main className="py-6">
        <AttendancePanel />
      </main>
    </div>
  );
}
