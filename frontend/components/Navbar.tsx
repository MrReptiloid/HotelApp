'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      router.push('/login');
    } catch {
      showToast('Logout failed', 'error');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center" aria-label="HotelApp Home">
              <span className="text-lg font-semibold text-gray-900">HotelApp</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-6" role="menubar">
              <Link
                href="/hotels"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                role="menuitem"
                aria-label="Browse hotels"
              >
                Hotels
              </Link>
              {user && (
                <Link
                  href="/bookings"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                  role="menuitem"
                  aria-label="View my bookings"
                >
                  My Bookings
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                  role="menuitem"
                  aria-label="Admin panel"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600" aria-label="Current user">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium border border-gray-200 transition"
                  aria-label="Logout from account"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition"
                  aria-label="Sign in to account"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                  aria-label="Create new account"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

