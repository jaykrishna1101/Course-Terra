import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase.from('courses').select('*').eq('status', 'published');
      setCourses(data || []);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  return (
    <div className="flex-1 bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            Master the Foundations with <span className="text-brand">Course Terra</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-8">
            Build a strong foundation through clear explanations, structured lessons, and practice-oriented learning.
          </p>
        </div>
      </section>

      {/* Course List Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Courses</h2>
        
        {loading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map(course => (
              <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col bg-white hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-100 flex items-center justify-center border-b border-gray-200">
                  {course.thumbnail_path ? (
                    <img src={course.thumbnail_path} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400 font-medium text-lg">Course Thumbnail</div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 flex-1">{course.short_description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold text-gray-900">₹{(course.price_paise / 100).toFixed(2)}</span>
                    <Link to={`/courses/${course.slug}`} className="text-brand font-medium hover:underline">View Course</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
