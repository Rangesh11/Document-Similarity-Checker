import React, { useState } from 'react';
import axios from 'axios';

const Compare = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFile(file);
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file1 || !file2) {
      setError('Please upload exactly two PDF files.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('documents', file1);
      formData.append('documents', file2);

      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODA0OGJlMDZmNTBiMWRhMThhOGZjOGMiLCJpYXQiOjE3NDUxMzMyODMsImV4cCI6MTc0NTEzNjg4M30.FUe2EUD0oyle2FiOTaQTMt1XqmaFrOmZ7og4oXTveHI"; // Replace with your actual JWT token

      const response = await axios.post('http://localhost:5000/api/documents/compare', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setResult(response.data);
    } catch (err) {
      console.error('Error occurred while comparing:', err);
      if (err.response) {
        setError(`Error: ${err.response.data.error || 'An unknown error occurred.'}`);
      } else {
        setError('Error comparing documents.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 p-8 flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-8 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-indigo-600">Compare Documents</h2>

          <div>
            <label htmlFor="file1" className="block text-gray-700">Upload First PDF</label>
            <input
              type="file"
              id="file1"
              onChange={(e) => handleFileChange(e, setFile1)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="file2" className="block text-gray-700">Upload Second PDF</label>
            <input
              type="file"
              id="file2"
              onChange={(e) => handleFileChange(e, setFile2)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </form>
      </div>

      {result && (
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-8 overflow-y-auto max-h-screen">
          <h2 className="text-3xl font-semibold text-indigo-700 mb-6 text-center">Comparison Results</h2>

          <div className="space-y-4">
            <p><strong>Cosine Similarity:</strong> {result.similarity}</p>
            <p><strong>Jaccard Similarity:</strong> {result.jaccardSimilarity}</p>
            <p><strong>Hamming Distance:</strong> {result.hammingDistance}</p>
            <p><strong>Plagiarism Detected:</strong> {result.plagiarismDetected}</p>
          </div>

          {result.similarContent && result.similarContent.length > 0 && (
            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Similar Paragraphs</h3>
              <div className="space-y-6 max-h-96 overflow-y-auto border p-4 rounded-md bg-gray-50">
                {result.similarContent.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-md shadow">
                    <p className="text-sm text-gray-600 mb-1">Paragraph {item.index1 + 1} in Document 1:</p>
                    <p className="mb-2 text-gray-800">{item.paragraph1}</p>
                    <p className="text-sm text-gray-600 mb-1">Paragraph {item.index2 + 1} in Document 2:</p>
                    <p className="mb-2 text-gray-800">{item.paragraph2}</p>
                    <p className="text-sm text-blue-600 font-medium">Similarity: {item.similarity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Compare;
