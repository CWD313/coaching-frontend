import React, { useState } from 'react';
import AttendanceChart from './AttendanceChart';
import MarksOverTimeChart from './MarksOverTimeChart';
import SubjectWiseChart from './SubjectWiseChart';
import performanceService from '../../services/performanceService';

export default function PerformanceChartsPanel() {
  const [studentQuery, setStudentQuery] = useState('');
  const [studentId, setStudentId] = useState('');
  const [searching, setSearching] = useState(false);
  const [students, setStudents] = useState([]);

  const handleSearch = async () => {
    if (!studentQuery) return;
    setSearching(true);
    try {
      const res = await performanceService.searchStudents(studentQuery, 1, 10);
      const list = res.students || res || [];
      setStudents(list);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <input
          value={studentQuery}
          onChange={(e) => setStudentQuery(e.target.value)}
          placeholder="Search student by name, mobile or ID"
          className="flex-1 p-2 border rounded-md"
        />
        <button className="px-3 py-2 bg-indigo-600 text-white rounded-md" onClick={handleSearch} disabled={searching}>Search</button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-3 rounded shadow-sm">
          <div className="text-sm font-medium mb-2">Select Student</div>
          <div className="space-y-2">
            {students.map((s) => (
              <button key={s._id} onClick={() => setStudentId(s._id)} className="w-full text-left p-2 rounded hover:bg-gray-50">
                {s.firstName} {s.lastName} — {s.studentId || s._id}
              </button>
            ))}
            {!students.length && <div className="text-sm text-gray-500">No search results</div>}
          </div>
        </div>

        {studentId ? (
          <>
            <AttendanceChart studentId={studentId} months={6} />
            <MarksOverTimeChart studentId={studentId} limit={50} />
            <SubjectWiseChart studentId={studentId} />
          </>
        ) : (
          <div className="text-sm text-gray-500">Search and select a student to view charts.</div>
        )}
      </div>
    </div>
  );
}
