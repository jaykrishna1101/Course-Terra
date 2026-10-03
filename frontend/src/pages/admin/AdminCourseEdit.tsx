import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminCourseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        // Fetch course directly from supabase for admin
        const { data, error } = await supabase.from('courses').select('*').eq('id', id).single();
        if (error) throw error;
        setCourse(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!course) return <div className="p-8 text-center text-red-600">Course not found</div>;

  return (
    <div className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit Course: {course.title}</h1>
          <button onClick={() => navigate('/admin')} className="text-sm text-gray-500 hover:text-gray-700 font-medium">&larr; Back to Admin</button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Title</label>
            <input type="text" defaultValue={course.title} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Short Description</label>
            <input type="text" defaultValue={course.short_description} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price (in paise)</label>
            <input type="number" defaultValue={course.price_paise} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select defaultValue={course.status} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <button className="bg-brand text-white px-4 py-2 rounded font-medium hover:bg-blue-700">Save Changes</button>
          </div>
        </div>
        
        {/* Modules section would go here, omitting for brevity in this simple demo, 
            but architecture supports full CRUD through /api/v1/admin endpoints */}
      </div>
    </div>
  );
}
