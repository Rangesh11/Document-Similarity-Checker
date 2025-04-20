import React from 'react';
import { BarChart2, FileText, HelpCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 mb-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        
        {/* Logo and Title */}
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-2 shadow">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Document Similarity Checker</h1>
            <p className="text-sm text-gray-500">AI-powered document analysis & plagiarism detection</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-5">
          <button className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">
            <HelpCircle className="w-4 h-4 mr-1" />
            Help
          </button>

          <button className="flex items-center bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors py-2 px-4 rounded-md text-sm font-medium">
            <BarChart2 className="w-4 h-4 mr-2" />
            View Reports
          </button>

          {/* Profile */}
          <div className="relative group">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-indigo-600 object-cover cursor-pointer"
            />
            {/* Future dropdown (optional) */}
            {/* <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
