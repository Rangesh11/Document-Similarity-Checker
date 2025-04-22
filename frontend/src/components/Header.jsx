import React, { useState } from 'react';
import { FileText, BarChart2, Database } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice'; 

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('')
    : user?.email?.split('@')[0].slice(0, 2).toUpperCase();

  return (
    <header className="bg-white shadow-sm mb-6">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-indigo-600 mr-2" />
          <h1 className="text-xl font-semibold text-gray-800">Document Similarity Checker</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-gray-600 hover:text-indigo-600 flex items-center">
            <BarChart2 className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Dashboard</span>
          </a>
          
          <a href="/history" className="text-gray-600 hover:text-indigo-600 flex items-center">
            <Database className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">History</span>
          </a>
          
          {user && (
            <div className="relative">
      
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
              >
                <div className="flex items-center justify-center bg-indigo-600 text-white w-8 h-8 rounded-full">
                  {userInitials}
                </div>
                <span className="hidden sm:inline text-gray-700 font-medium">{user.name || user.email}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm text-gray-700 text-left hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
