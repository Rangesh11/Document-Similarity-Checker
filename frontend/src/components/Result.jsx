import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const Result = () => {
  const { id } = useParams();
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('side-by-side');

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const response = await api.get(`/comparisons/${id}`);
        setComparison(response.data);
      } catch (err) {
        setError('Failed to load comparison data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p>{error}</p>
          <Link to="/" className="mt-4 inline-block text-purple-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-yellow-700">
          <p>Comparison not found</p>
          <Link to="/" className="mt-4 inline-block text-purple-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-700 to-indigo-800 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{comparison.title}</h1>
              {comparison.description && (
                <p className="text-purple-200 mt-1">{comparison.description}</p>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/compare"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-purple-700 bg-white hover:bg-purple-50"
              >
                Create New Comparison
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('side-by-side')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'side-by-side'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Side by Side
            </button>
            <button
              onClick={() => setActiveTab('original')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'original'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Original
            </button>
            <button
              onClick={() => setActiveTab('enhanced')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'enhanced'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Enhanced
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'side-by-side' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Original Text</h2>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 whitespace-pre-wrap">
                  {comparison.originalText}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Enhanced Text</h2>
                <div className="bg-purple-50 p-4 rounded-md border border-purple-200 whitespace-pre-wrap">
                  {comparison.enhancedText}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'original' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Original Text</h2>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 whitespace-pre-wrap">
                {comparison.originalText}
              </div>
            </div>
          )}
          
          {activeTab === 'enhanced' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Enhanced Text</h2>
              <div className="bg-purple-50 p-4 rounded-md border border-purple-200 whitespace-pre-wrap">
                {comparison.enhancedText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
