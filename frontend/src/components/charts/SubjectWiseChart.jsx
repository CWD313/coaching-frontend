import React, { useEffect, useState } from 'react';
import BarChart from './BarChart';
import performanceService from '../../services/performanceService';

export default function SubjectWiseChart({ studentId }) {
  const [labels, setLabels] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!studentId) return;
    setLoading(true);
    performanceService.getSubjectWiseMarks(studentId)
      .then((res) => {
        const rows = res.summary || res;
        const labs = rows.map((r) => r.subject);
        const vals = rows.map((r) => +(r.averagePercentage ?? r.averagePercentage).toFixed ? +r.averagePercentage : +r.averagePercentage || 0);
        if (mounted) {
          setLabels(labs);
          setDataPoints(vals);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [studentId]);

  const datasets = [
    {
      label: 'Average %',
      data: dataPoints,
      backgroundColor: 'rgba(249,115,22,0.8)',
    },
  ];

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <h3 className="text-sm font-medium mb-2">Subject-wise Performance</h3>
      {loading ? <div className="text-sm text-gray-500">Loading...</div> : <BarChart labels={labels} datasets={datasets} />}
    </div>
  );
}
