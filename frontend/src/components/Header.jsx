import React from 'react';
import { FileText, BarChart2, Database } from 'lucide-react';
import { useSelector } from 'react-redux';

const Header = () => {
  const { user } = useSelector((state) => state.auth);

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
            <div className="text-gray-700 font-medium">
              {user.name || user.email}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;