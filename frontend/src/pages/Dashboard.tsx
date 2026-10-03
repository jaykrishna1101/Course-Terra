import { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchApi('/me/courses');
        setEnrollments(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Learning</h1>

        {loading ? (
          <div>Loading...</div>
        ) : enrollments.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't enrolled in any courses yet.</h3>
            <p className="text-gray-500 mb-6">Explore our catalog to start learning.</p>
            <Link to="/" className="inline-block bg-brand text-white px-6 py-2 rounded font-medium hover:bg-blue-700">Browse Courses</Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.map(enr => {
              const course = enr.courses;
              return (
                <div key={course.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm">
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-6 flex-1">{course.short_description}</p>
                    <Link to={`/learn/${course.id}`} className="block text-center bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 font-medium">
                      Resume Course
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
