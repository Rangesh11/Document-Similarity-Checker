import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ResultsPanel from '../components/ResultsPanel';

const ProfilePage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [lastComparisons, setLastComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    // Fetch profile data
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/profile/get', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile data');
        }
        setProfileData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching profile data:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch the last two comparisons
    const fetchLastComparisons = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile/last-comparisons', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch last comparisons');
        }

        setLastComparisons(data.slice(0, 2)); // Only take the last two comparisons
      } catch (error) {
        console.error('Error fetching last comparisons:', error.message);
        setError(error.message);
      }
    };

    fetchProfileData();
    fetchLastComparisons();
  }, [user, token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h2>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && profileData && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {profileData.username ? profileData.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{profileData.username}</h3>
                  <p className="text-gray-600">{profileData.email}</p>
                  {profileData.role && (
                    <p className="text-sm text-blue-600 mt-1 bg-blue-50 px-2 py-1 rounded-full inline-block">
                      {profileData.role}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-lg font-medium text-gray-800 mb-3">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">{profileData.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{profileData.email}</p>
                  </div>
                  {profileData.createdAt && (
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">
                        {new Date(profileData.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Display the last two comparisons side by side */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Recent Comparisons</h3>
          {lastComparisons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lastComparisons.map((comparison, index) => (
                <div key={comparison._id || index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                    <h4 className="text-lg font-medium text-gray-800">
                      Comparison #{index + 1} - {new Date(comparison.createdAt || Date.now()).toLocaleDateString()}
                    </h4>
                  </div>
                  <ResultsPanel result={comparison} loading={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600">No comparisons found. Start comparing documents to see your history here.</p>
              <button 
                onClick={() => navigate('/')} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Compare Documents
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
