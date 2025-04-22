import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FileText, Upload, AlertTriangle, CheckCircle, X } from 'lucide-react';

import Header from './Header';
import ResultsPanel from './ResultsPanel';

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
    const validFileTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'text/plain'
    ];
    
    const invalidFiles = newFiles.filter(file => !validFileTypes.includes(file.type));
    
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

  const FileUpload = ({ 
    files, 
    loading, 
    error, 
    handleFileChange, 
    removeFile, 
    handleSubmit 
  }) => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 transition-all">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center">
          <FileText className="h-6 w-6 mr-3 text-indigo-600" />
          Document Comparison
        </h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block font-medium text-gray-700 mb-2">Upload Documents</label>
            
            <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                multiple
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-10 w-10 text-indigo-500 mb-3" />
                <p className="text-lg font-medium text-indigo-700">Drop files here or click to browse</p>
                <p className="text-sm text-gray-500 mt-1">Supported formats: PDF, DOCX, TXT</p>
              </label>
            </div>
            
            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">Selected Files ({files.length}/2)</h3>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-indigo-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-800 truncate max-w-xs">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || files.length !== 2}
            className={`w-full py-3 px-6 rounded-lg text-white font-medium flex items-center justify-center transition-colors ${
              loading || files.length !== 2
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Comparing Documents...
              </>
            ) : (
              'Compare Documents'
            )}
          </button>
        </form>
      </div>
    );
  };

  const HowItWorks = () => {
    const steps = [
      {
        title: "Upload Documents",
        description: "Select two documents you want to compare (PDF, DOCX, or TXT)",
        icon: <Upload className="h-6 w-6 text-indigo-600" />
      },
      {
        title: "AI Analysis",
        description: "Our advanced AI will analyze the content for similarities and differences",
        icon: <div className="p-1 rounded-full bg-indigo-100"><FileText className="h-5 w-5 text-indigo-600" /></div>
      },
      {
        title: "Review Comparison",
        description: "View detailed results with highlighted matching sections and similarity metrics",
        icon: <CheckCircle className="h-6 w-6 text-green-600" />
      }
    ];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">How It Works</h3>
        
        <div className="flex flex-col space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                  {step.icon}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-800">{step.title}</h4>
                <p className="text-gray-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <p className="text-sm text-indigo-700 font-medium">
            Our document comparison tool uses state-of-the-art algorithms to detect similarities 
            between documents, helping you identify potential plagiarism or content overlap.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Header is already sticky in its component */}
      <Header />
      
      <div className="max-w-7xl mx-auto pt-6 px-4 md:px-8 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left panel - Upload form */}
          <div className="w-full md:w-1/2 space-y-6">
            <FileUpload 
              files={files}
              loading={loading}
              error={error}
              handleFileChange={handleFileChange}
              removeFile={removeFile}
              handleSubmit={handleSubmit}
            />
            <HowItWorks />
          </div>
          
          {/* Right panel - Results */}
          <div id="results" className="w-full md:w-1/2">
            <div className="bg-white rounded-xl shadow-lg h-full overflow-hidden">
              <ResultsPanel result={result} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;