import React, { useState, useRef, useEffect } from 'react';
import { FileText, BarChart2, Database, ChevronDown, User, LogOut, Menu, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('')
    : user?.email?.split('@')[0].slice(0, 2).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/login'); // 👈 Redirect to login after logout
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prevState) => !prevState);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg shadow-md mr-3">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            DocCompare
          </h1>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-md flex items-center transition-colors ${
              isActive('/') 
                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
            }`}
          >
            <FileText className="h-5 w-5 mr-2" />
            Compare
          </Link>
          
          <Link
            to="/history"
            className={`px-4 py-2 rounded-md flex items-center transition-colors ${
              isActive('/history') 
                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
            }`}
          >
            <Database className="h-5 w-5 mr-2" />
            History
          </Link>

          {user && (
            <div className="relative ml-4" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <div className="flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-8 h-8 rounded-full shadow-sm">
                  {userInitials}
                </div>
                <span className="text-gray-700 font-medium max-w-[120px] truncate">
                  {user.name || user.email?.split('@')[0]}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="h-4 w-4 mr-3 text-gray-500" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut className="h-4 w-4 mr-3 text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded-md ${
                isActive('/dashboard') 
                  ? 'bg-indigo-50 text-indigo-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-3" />
                Dashboard
              </div>
            </Link>
            
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md ${
                isActive('/') 
                  ? 'bg-indigo-50 text-indigo-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3" />
                Compare
              </div>
            </Link>
            
            <Link
              to="/history"
              className={`block px-3 py-2 rounded-md ${
                isActive('/history') 
                  ? 'bg-indigo-50 text-indigo-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Database className="h-5 w-5 mr-3" />
                History
              </div>
            </Link>

            {user && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3" />
                    Profile
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
