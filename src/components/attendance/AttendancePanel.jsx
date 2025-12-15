import React, { useEffect, useState, useCallback } from 'react';
import BatchSelector from './BatchSelector';
import DatePicker from './DatePicker';
import StudentRow from './StudentRow';
import AbsentSummary from './AbsentSummary';
import attendanceService from '../../services/attendanceService';

const DEFAULT_LIMIT = 10;

export default function AttendancePanel() {
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);
  const [loading, setLoading] = useState(false);
  const [savingMap, setSavingMap] = useState({});
  const [totalAbsent, setTotalAbsent] = useState(0);

  useEffect(() => {
    // load batches
    let mounted = true;
    attendanceService.getBatches().then((res) => {
      if (!mounted) return;
      const list = Array.isArray(res) ? res : res.batches || [];
      setBatches(list);
      if (list.length && !batchId) setBatchId(list[0]._id || list[0].id);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const fetchAttendance = useCallback(() => {
    if (!batchId || !date) return;
    setLoading(true);
    attendanceService.getAttendanceByDate(batchId, date, page, limit)
      .then((res) => {
        // response expected: { success, data: { students: [], total } } OR older formats
        const payload = res.data || res.students || res;
        const list = Array.isArray(payload) ? payload : (payload.students || []);
        setStudents(list.map((s) => ({ ...s, status: s.status || 'absent' })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // fetch absent summary total
    attendanceService.getAbsentList(batchId, date, 1, 1)
      .then((r) => {
        const t = r.total || (r.meta && r.meta.total) || (Array.isArray(r) ? r.length : 0);
        setTotalAbsent(t);
      })
      .catch(() => setTotalAbsent(0));
  }, [batchId, date, page, limit]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  const handleToggle = async (studentId, newStatus) => {
    // optimistic UI
    setStudents((prev) => prev.map((s) => (s._id === studentId ? { ...s, status: newStatus } : s)));
    setSavingMap((m) => ({ ...m, [studentId]: true }));

    try {
      await attendanceService.markAttendance(batchId, date, [{ studentId, status: newStatus }]);
    } catch (err) {
      // revert on error
      setStudents((prev) => prev.map((s) => (s._id === studentId ? { ...s, status: s.status } : s)));
    } finally {
      setSavingMap((m) => {
        const copy = { ...m };
        delete copy[studentId];
        return copy;
      });
      // refresh absent summary
      attendanceService.getAbsentList(batchId, date, 1, 1).then((r) => {
        const t = r.total || (r.meta && r.meta.total) || (Array.isArray(r) ? r.length : 0);
        setTotalAbsent(t);
      }).catch(() => {});
    }
  };

  const absentListOnPage = students.filter((s) => s.status === 'absent');

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 gap-4 mb-4">
        <BatchSelector batches={batches} value={batchId} onChange={(v) => { setBatchId(v); setPage(1); }} />
        <DatePicker value={date} onChange={(d) => { setDate(d); setPage(1); }} />
        <div className="flex-1" />
        <div className="text-sm text-gray-600">Showing {students.length} students</div>
      </div>

      <div className="bg-white rounded-md shadow-sm p-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <div>
            <div className="divide-y">
              {students.length === 0 && (
                <div className="py-6 text-center text-gray-500">No students found for this batch/date.</div>
              )}

              {students.map((stu) => (
                <StudentRow
                  key={stu._id}
                  student={stu}
                  onToggle={handleToggle}
                  saving={!!savingMap[stu._id]}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">Page {page}</div>
              <div className="space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 bg-gray-100 rounded-md"
                >Prev</button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 bg-gray-100 rounded-md"
                >Next</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AbsentSummary absentList={absentListOnPage} totalAbsent={totalAbsent} />
    </div>
  );
}
