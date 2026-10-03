import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: 0, revenue: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: cData } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
        setCourses(cData || []);

        const { count: uCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        // Simplified revenue:
        const { data: pData } = await supabase.from('purchases').select('amount_paise').eq('status', 'paid');
        const rev = (pData || []).reduce((acc, curr) => acc + curr.amount_paise, 0);

        setStats({ users: uCount || 0, revenue: rev });
      } catch (e) {
        console.error(e);
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6 text-center">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.users}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6 text-center">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">₹{(stats.revenue / 100).toFixed(2)}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6 text-center">
              <dt className="text-sm font-medium text-gray-500 truncate">Courses</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{courses.length}</dd>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Courses</h3>
            <button className="bg-brand text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Create New Course
            </button>
          </div>
          <ul className="divide-y divide-gray-200">
            {courses.map(course => (
              <li key={course.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{course.title}</h4>
                  <p className="text-sm text-gray-500">{course.status.toUpperCase()} • ₹{(course.price_paise / 100).toFixed(2)}</p>
                </div>
                <div>
                  <Link to={`/admin/courses/${course.id}`} className="text-brand font-medium hover:underline text-sm border border-brand px-3 py-1.5 rounded bg-blue-50">
                    Edit Course
                  </Link>
                </div>
              </li>
            ))}
            {courses.length === 0 && (
              <li className="p-8 text-center text-gray-500">No courses found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
