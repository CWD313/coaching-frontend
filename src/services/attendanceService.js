const API_BASE = process.env.REACT_APP_API_URL || '';

const getToken = () => localStorage.getItem('token');

async function request(path, options = {}) {
  const headers = options.headers || {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json();
}

export const getBatches = async () => request('/api/batches');

export const getAttendanceByDate = async (batchId, date, page = 1, limit = 10) =>
  request(`/api/attendance/date?batchId=${batchId}&date=${encodeURIComponent(date)}&page=${page}&limit=${limit}`);

export const markAttendance = async (batchId, date, attendanceArray) =>
  request('/api/attendance/mark', {
    method: 'POST',
    body: JSON.stringify({ batchId, date, attendance: attendanceArray }),
  });

export const getAbsentList = async (batchId, date, page = 1, limit = 100) =>
  request(`/api/attendance/absent-list?batchId=${batchId}&date=${encodeURIComponent(date)}&page=${page}&limit=${limit}`);

export default { getBatches, getAttendanceByDate, markAttendance, getAbsentList };
