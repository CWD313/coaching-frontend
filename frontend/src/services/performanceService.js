const API_BASE = process.env.REACT_APP_API_URL || '';

const getToken = () => localStorage.getItem('token');

async function request(path, options = {}) {
  const headers = options.headers || {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json();
}

export const getMonthlyAttendance = async (studentId, year, month) =>
  request(`/api/performance/attendance-monthly?studentId=${studentId}&year=${year}&month=${month}`);

export const getMarksOverTime = async (studentId, limit = 100) =>
  request(`/api/performance/marks-over-time?studentId=${studentId}&limit=${limit}`);

export const getSubjectWiseMarks = async (studentId) =>
  request(`/api/performance/subject-wise?studentId=${studentId}`);

export const searchStudents = async (q, page = 1, limit = 20) =>
  request(`/api/performance/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);

export default { getMonthlyAttendance, getMarksOverTime, getSubjectWiseMarks, searchStudents };
