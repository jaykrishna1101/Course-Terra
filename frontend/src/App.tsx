import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { Layout } from './layouts/Layout';
import { ProtectedRoute, AdminRoute } from './components/RouteGuards';

// Pages (to be created)
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CourseDetails from './pages/CourseDetails';
import Dashboard from './pages/Dashboard';
import Learning from './pages/Learning';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourseEdit from './pages/admin/AdminCourseEdit';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/courses/:slug" element={<CourseDetails />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/learn/:courseId" element={<Learning />} />
              <Route path="/learn/:courseId/lesson/:lessonId" element={<Learning />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/courses/:id" element={<AdminCourseEdit />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
