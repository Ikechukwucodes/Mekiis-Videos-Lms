import React, { useState, useEffect } from 'react';
import { enrollmentService } from '../../services/enrollmentService.js';
import { Badge } from '../../components/common/Badge.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Award, Search, CheckCircle, Clock } from 'lucide-react';

export const AdminEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    enrollmentService
      .getAdminEnrollments()
      .then(setEnrollments)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = enrollments.filter(
    (e) =>
      e.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.courseId?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Platform Enrollment Roster</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Auditing record of all student course enrollments and certification status
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 transition-colors">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by student, email, or course..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {filtered.length} total enrollment{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 dark:text-slate-500">Loading enrollments...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">No enrollments recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course Enrolled</th>
                  <th className="px-6 py-4">Enrolled Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((e) => (
                  <tr key={e._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{e.userId?.name || 'Deleted User'}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">{e.userId?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{e.courseId?.title || 'Unknown Course'}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">{e.courseId?.category}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {new Date(e.enrolledAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={e.status === 'completed' ? 'success' : 'brand'}>
                        {e.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
