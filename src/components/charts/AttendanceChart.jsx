import React, { useEffect, useState } from 'react';
import LineChart from './LineChart';
import performanceService from '../../services/performanceService';

// Renders attendance percentage for last N months (default 6)
export default function AttendanceChart({ studentId, months = 6 }) {
  const [labels, setLabels] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!studentId) return;

    const load = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const results = [];
        const l = [];
        for (let i = months - 1; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const year = d.getFullYear();
          const month = d.getMonth() + 1;
          l.push(d.toLocaleString(undefined, { month: 'short', year: 'numeric' }));
          // call API per month
          // If backend supports range queries later, replace with single aggregated call
          // NOTE: Simple sequential calls to keep client logic simple
          // You may parallelize for performance
          // eslint-disable-next-line no-await-in-loop
          const res = await performanceService.getMonthlyAttendance(studentId, year, month);
          results.push(res.percentage ?? 0);
        }

        if (!mounted) return;
        setLabels(l);
        setDataPoints(results.map((v) => +v));
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [studentId, months]);

  const chartDatasets = [
    {
      label: 'Attendance %',
      data: dataPoints,
      fill: false,
      borderColor: 'rgba(59,130,246,1)',
      backgroundColor: 'rgba(59,130,246,0.5)',
      tension: 0.2,
    },
  ];

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <h3 className="text-sm font-medium mb-2">Monthly Attendance</h3>
      {loading ? <div className="text-sm text-gray-500">Loading...</div> : <LineChart labels={labels} datasets={chartDatasets} />}
    </div>
  );
}
