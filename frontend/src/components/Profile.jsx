import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Import Header if it exists separately

const ProfilePage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
        try {
            console.log('User token:', token); // Log the token before sending the request

          const response = await fetch('http://localhost:5000/api/profile/get', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          console.log(response);
          const data = await response.json();
      
          if (!response.ok) {
            console.error('API error:', data.message);
            throw new Error(data.message || 'Failed to fetch');
          }
      
          setProfileData(data);
        } catch (error) {
          console.error('Error fetching profile data:', error.message);
        }
      };
      

    fetchProfileData();
  }, [user, navigate]);

  if (!profileData) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Profile</h2>
        <div className="bg-white p-4 border rounded-lg shadow-md space-y-2">
          <p><strong>Username:</strong> {profileData.username}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
