import React, { useEffect, useState } from 'react';
import LineChart from './LineChart';
import performanceService from '../../services/performanceService';

export default function MarksOverTimeChart({ studentId, limit = 100 }) {
  const [labels, setLabels] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!studentId) return;
    setLoading(true);
    performanceService.getMarksOverTime(studentId, limit)
      .then((res) => {
        const rows = res.data || res;
        const labs = rows.map((r) => new Date(r.date).toLocaleDateString());
        const vals = rows.map((r) => (r.percentage != null ? +r.percentage : (r.totalMarks ? Math.round((r.marksObtained / r.totalMarks) * 100 * 100) / 100 : 0)));
        if (mounted) {
          setLabels(labs);
          setDataPoints(vals);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [studentId, limit]);

  const datasets = [
    {
      label: 'Score %',
      data: dataPoints,
      borderColor: 'rgba(16,185,129,1)',
      backgroundColor: 'rgba(16,185,129,0.4)',
      tension: 0.2,
      fill: true,
    },
  ];

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <h3 className="text-sm font-medium mb-2">Marks vs Date</h3>
      {loading ? <div className="text-sm text-gray-500">Loading...</div> : <LineChart labels={labels} datasets={datasets} />}
    </div>
  );
}
