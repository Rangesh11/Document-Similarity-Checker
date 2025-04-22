import React from 'react';

const ResultTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b mb-6 overflow-x-auto">
      <button 
        className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'summary' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        onClick={() => setActiveTab('summary')}
      >
        Summary
      </button>
      <button 
        className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'details' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        onClick={() => setActiveTab('details')}
      >
        Similar Content
      </button>
      <button 
        className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'analysis' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        onClick={() => setActiveTab('analysis')}
      >
        AI Analysis
      </button>
      <button 
        className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'structure' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        onClick={() => setActiveTab('structure')}
      >
        Structure
      </button>
    </div>
  );
};

export default ResultTabs;