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
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Course Terra. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
