// src/components/layout/Header.tsx
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // ✅ install with: npm install lucide-react

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl sm:text-2xl font-bold tracking-wide"
        >
          Enterprise Task Manager
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none focus:ring-2 focus:ring-white rounded-lg"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm sm:text-base">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="hover:underline font-medium transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:underline font-medium">
                Login
              </Link>
              <Link to="/register" className="hover:underline font-medium">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 text-center py-3 space-y-3 animate-slide-down">
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                closeMenu();
              }}
              className="block w-full hover:bg-blue-800 py-2 font-medium"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block hover:bg-blue-800 py-2 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="block hover:bg-blue-800 py-2 font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
