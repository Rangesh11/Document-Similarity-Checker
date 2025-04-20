import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';  // Import your Login component
import SignUp from './components/SignUp';  // Import your SignUp component
import Compare from './components/Compare'

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Compare/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;