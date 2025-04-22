import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FileText } from 'lucide-react';

import FileUpload from './FileUpload';
import ResultsPanel from './ResultsPanel';
import Header from './Header';
// import Instruction from './Instruction'

const Compare = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  
  const { user, token } = useSelector((state) => state.auth);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    if (newFiles.length === 0) return;
    
    // Validate file types
    const invalidFiles = newFiles.filter(file => 
      !['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      .includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError('Please upload only PDF, DOCX, or TXT files.');
      return;
    }
    
    if (files.length + newFiles.length > 2) {
      setError('You can only compare two documents at a time.');
      return;
    }
    
    setFiles([...files, ...newFiles]);
    setError('');
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length !== 2) {
      setError('Please upload exactly two files to compare.');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('documents', file);
      });

      if (user.email) {
        formData.append('email', user.email);
      }

      const response = await axios.post('http://localhost:5000/api/documents/compare', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setResult(response.data);
 
      if (window.innerWidth < 768) {
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Error occurred while comparing:', err);
      if (err.response) {
        setError(`Error: ${err.response.data.error || 'An unknown error occurred.'}`);
      } else {
        setError('Error comparing documents. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 p-4 md:p-8">
      <Header/>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left panel - Upload form */}
          <div className="w-full md:w-1/2">
            <FileUpload 
              files={files}
              loading={loading}
              error={error}
              handleFileChange={handleFileChange}
              removeFile={removeFile}
              handleSubmit={handleSubmit}
            />
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
    <h3 className="text-lg font-medium text-gray-800 mb-2">How It Works</h3>
    <ol className="list-decimal pl-5 space-y-2 text-gray-700">
      <li>Upload two documents you want to compare (PDF, DOCX, or TXT)</li>
      <li>Our AI will analyze the content for similarities</li>
      <li>View a detailed comparison with highlighted matching sections</li>
      <li>See similarity scores and potential plagiarism indicators</li>
    </ol>
  </div>
          </div>
          
          {/* Right panel - Results */}
          <div id="results" className="w-full md:w-1/2">
            <ResultsPanel result={result} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;