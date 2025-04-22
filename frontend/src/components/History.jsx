import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ResultsPanel from './ResultsPanel';
import Header from './Header'; 
import { Clock, Search } from 'lucide-react';

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user || !token) {
        setError('Authentication required. Please login to view history.');
        setLoading(false);
        return;
      }

      try {
        const authToken = token || localStorage.getItem('token');

        if (!authToken) {
          setError('Authentication token not found. Please login again.');
          setLoading(false);
          return;
        }

        const response = await axios.post(
          'http://localhost:5000/api/history',
          { email: user.email },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            }
          }
        );

        setHistoryData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError(
          err.response?.data?.message ||
          'Failed to fetch history data. Please try again later.'
        );
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, token]);

  const filteredHistory = searchTerm
    ? historyData.filter(item =>
        item.document1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.document2?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : historyData;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500">
      <Header />

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-700 flex items-center">
            <Clock className="h-6 w-6 mr-2" />
            Comparison History
          </h2>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search your comparison history..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}

        {!error && filteredHistory.length === 0 && !loading && (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            {searchTerm ? (
              <p className="text-gray-600">No results found for "{searchTerm}".</p>
            ) : (
              <p className="text-gray-600">No comparison history found.</p>
            )}
          </div>
        )}

        {!error && filteredHistory.length > 0 && (
          <div className="space-y-6">
            {Array.from({ length: Math.ceil(filteredHistory.length / 2) }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHistory
                  .slice(rowIndex * 2, rowIndex * 2 + 2)
                  .map((item, index) => (
                    <div key={item._id || index} className="bg-gray-50 rounded-lg p-4 shadow">
                      <div className="mb-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          Comparison #{rowIndex * 2 + index + 1} -{' '}
                          {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                        </h3>
                        <div className="text-sm text-gray-500 mt-1">
                          Files: {item.fileInfo?.file1?.name || 'Document 1'} &{' '}
                          {item.fileInfo?.file2?.name || 'Document 2'}
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-md overflow-hidden">
                        <ResultsPanel result={item} loading={false} />
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
