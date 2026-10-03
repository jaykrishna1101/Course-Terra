import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchApi } from '../lib/api';

export default function Learning() {
  const { courseId, lessonId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [currentLessonData, setCurrentLessonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCourse = async () => {
      try {
        // Find course slug from somewhere, or we might need an endpoint to get course by ID directly
        // Wait, the API `/api/v1/courses/:slug` expects slug. Let's assume we have an endpoint for ID, or we just fetch it.
        // I will change the backend endpoint to handle ID or slug later, but for now let's assume we can fetch by slug if we know it.
        // Actually, let's just fetch all courses and find by ID. (Not optimal, but works for MVP).
        const resAll = await fetchApi('/courses/');
        const c = resAll.data.find((x:any) => x.id === courseId);
        if(c) {
          const res = await fetchApi(`/courses/${c.slug}`);
          setCourse(res.data);
          
          if(!lessonId && res.data.modules?.length > 0 && res.data.modules[0].lessons?.length > 0) {
             // select first lesson if none provided (optional, we just show empty state otherwise)
          }
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [courseId]);

  useEffect(() => {
    if (lessonId) {
      const loadLessonContent = async () => {
        setLessonLoading(true);
        try {
          const res = await fetchApi(`/lessons/${lessonId}/content`);
          setCurrentLessonData(res.data);
        } catch (e: any) {
          console.error(e);
          setCurrentLessonData({ error: e.message });
        } finally {
          setLessonLoading(false);
        }
      };
      loadLessonContent();
    }
  }, [lessonId]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error || !course) return <div className="p-8 text-red-600">Error: {error || 'Course not found'}</div>;

  return (
    <div className="flex-1 flex bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto hidden md:block">
        <div className="p-4 border-b border-gray-200 bg-gray-100">
          <Link to={`/courses/${course.slug}`} className="text-sm font-semibold text-gray-500 hover:text-brand mb-1 block">&larr; Back to Course</Link>
          <h2 className="font-bold text-gray-900 leading-tight">{course.title}</h2>
        </div>
        <div className="p-4 space-y-6">
          {course.modules?.map((mod: any) => (
            <div key={mod.id}>
              <h3 className="font-bold text-sm text-gray-900 mb-2 uppercase tracking-wide">{mod.title}</h3>
              <ul className="space-y-1">
                {mod.lessons?.map((lesson: any) => {
                  const isActive = lesson.id === lessonId;
                  return (
                    <li key={lesson.id}>
                      <Link 
                        to={`/learn/${course.id}/lesson/${lesson.id}`}
                        className={`block px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'bg-brand text-white font-medium' : 'text-gray-700 hover:bg-gray-200'}`}
                      >
                        {lesson.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {!lessonId ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to {course.title}</h2>
              <p className="text-gray-500">Select a lesson from the menu to begin.</p>
            </div>
          ) : lessonLoading ? (
            <div>Loading lesson content...</div>
          ) : currentLessonData?.error ? (
            <div className="bg-red-50 text-red-700 p-6 rounded-md border border-red-200">
              <h3 className="font-bold mb-2">Access Denied</h3>
              <p>{currentLessonData.error}</p>
            </div>
          ) : (
            <div>
              {/* Lesson Viewer logic based on content type... */}
              {currentLessonData?.external_url && (
                <div className="aspect-w-16 aspect-h-9 mb-8 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                  <a href={currentLessonData.external_url} target="_blank" rel="noreferrer" className="text-blue-400 underline">Open External Link</a>
                </div>
              )}
              {currentLessonData?.signed_url && (
                 <div className="mb-8">
                    {/* Just providing a link for protected assets for now */}
                    <a href={currentLessonData.signed_url} target="_blank" rel="noreferrer" className="bg-gray-100 border border-gray-200 px-4 py-2 rounded text-brand font-medium hover:bg-gray-200 inline-block">Download / View Protected Asset</a>
                 </div>
              )}
              <div className="prose prose-blue max-w-none text-gray-800">
                {/* For text content */}
                {currentLessonData?.content ? (
                  <div dangerouslySetInnerHTML={{ __html: currentLessonData.content.replace(/\n/g, '<br/>') }} />
                ) : (
                  <p className="text-gray-500 italic">No text content available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
