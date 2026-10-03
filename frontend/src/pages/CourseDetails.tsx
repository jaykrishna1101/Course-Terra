import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export default function CourseDetails() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buyError, setBuyError] = useState('');

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await fetchApi(`/courses/${slug}`);
        setCourse(res.data);
        if (user && res.data) {
          const accessRes = await fetchApi(`/courses/${res.data.id}/access`);
          setHasAccess(accessRes.data.has_access);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [slug, user]);

  const handleBuy = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Load Razorpay script if not already loaded
      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => { script.onload = resolve; });
      }

      const res = await fetchApi('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ course_id: course.id })
      });

      const { provider_order_id, amount_paise, currency } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount_paise,
        currency: currency,
        name: "Course Terra",
        description: course.title,
        order_id: provider_order_id,
        prefill: {
          name: user.user_metadata?.full_name || "",
          email: user.email || ""
        },
        theme: {
          color: "#2563EB"
        },
        handler: function () {
          alert("Payment successful! Unlocking your course...");
          // Wait for webhook to update DB, then reload
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function () {
        setBuyError("Payment failed or was cancelled.");
      });
      rzp.open();
    } catch (e: any) {
      setBuyError(e.message || 'Online payments are currently unavailable. Please check back soon.');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!course) return <div className="p-8 text-center text-red-600">Course not found</div>;

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl">{course.short_description}</p>
          <div className="text-gray-400 mb-8">Instructed by <span className="text-white font-medium">{course.instructor_name}</span></div>
          
          <div className="flex items-center space-x-6">
            <div className="text-3xl font-bold">₹{(course.price_paise / 100).toFixed(2)}</div>
            {hasAccess ? (
              <button onClick={() => navigate(`/learn/${course.id}`)} className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium text-lg shadow-sm">
                Continue Learning
              </button>
            ) : (
              <button onClick={handleBuy} className="bg-brand text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium text-lg shadow-sm">
                Buy for ₹{(course.price_paise / 100).toFixed(2)}
              </button>
            )}
          </div>
          {buyError && <div className="mt-4 p-4 bg-red-900/50 text-red-200 border border-red-800 rounded">{buyError}</div>}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this course</h2>
            <div className="prose prose-blue text-gray-600">
              {course.description}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Curriculum</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              {course.modules?.map((mod: any, i: number) => (
                <div key={mod.id} className={`border-gray-200 ${i !== 0 ? 'border-t' : ''}`}>
                  <div className="bg-gray-50 px-6 py-4 font-semibold text-gray-900">
                    {mod.title}
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {mod.lessons?.map((lesson: any) => (
                      <li key={lesson.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                        <span className="text-gray-700">{lesson.title}</span>
                        {lesson.is_preview && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">Preview</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Course Features</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="mr-3">✓</span> Lifetime access
              </li>
              <li className="flex items-center">
                <span className="mr-3">✓</span> Structured modules
              </li>
              <li className="flex items-center">
                <span className="mr-3">✓</span> Concept-focused learning
              </li>
              <li className="flex items-center">
                <span className="mr-3">✓</span> Beginner to intermediate
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
