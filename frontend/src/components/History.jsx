import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    
        const response = await axios.post('http://localhost:5000/api/history',
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Comparison History</h2>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {!error && historyData.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No comparison history found.</p>
        </div>
      )}

      {!error && historyData.length > 0 && (
        <div className="space-y-4">
          {historyData.map((item, index) => (
            <div key={item._id || index} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                <h3 className="font-medium text-gray-800">Comparison #{index + 1}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                  })}
                </p>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Document 1</h4>
                    <p className="text-gray-800 break-words">{item.document1}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Document 2</h4>
                    <p className="text-gray-800 break-words">{item.document2}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Similarity Score</h4>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, Math.max(0, item.similarityScore * 100))}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {(item.similarityScore * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;