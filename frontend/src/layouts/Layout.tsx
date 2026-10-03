import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export const Layout = () => {
  const { user, isAdmin } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-xl font-bold text-brand">Course Terra</Link>
            <nav className="flex space-x-4 items-center">
              {user ? (
                <>
                  {isAdmin && <Link to="/admin" className="text-sm text-gray-600 hover:text-brand font-medium">Admin</Link>}
                  <Link to="/dashboard" className="text-sm text-gray-600 hover:text-brand font-medium">Dashboard</Link>
                  <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-brand font-medium">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-gray-600 hover:text-brand font-medium">Log in</Link>
                  <Link to="/signup" className="text-sm bg-brand text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">Sign up</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <footer className="bg-gray-50 border-t border-gray-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Course Terra</h3>
              <p className="text-sm text-gray-600 mb-4">Build a strong foundation through clear explanations, structured lessons, and practice-oriented learning.</p>
            </div>
            <div className="flex flex-col md:items-end space-y-2 text-sm text-gray-600">
              <Link to="/contact" className="hover:text-brand">Contact Us</Link>
              <Link to="/terms" className="hover:text-brand">Terms & Conditions</Link>
              <Link to="/privacy" className="hover:text-brand">Privacy Policy</Link>
              <Link to="/refund" className="hover:text-brand">Refund & Cancellation Policy</Link>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Course Terra. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Jaykrishna Khond | Pune, Maharashtra, India</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
