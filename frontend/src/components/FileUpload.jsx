import React from 'react';
import { Upload, X, AlertTriangle } from 'lucide-react';

const FileUpload = ({ files, loading, error, handleFileChange, removeFile, handleSubmit }) => {
  const getFileIcon = (file) => {
    if (file.type === 'application/pdf') return 'PDF';
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'DOCX';
    if (file.type === 'text/plain') return 'TXT';
    return 'File';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-indigo-600 mb-6">
        Document Similarity Checker
      </h2>
      
      <div className="mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer"
          onClick={() => document.getElementById('fileInput').click()}>
          <Upload className="h-12 w-12 mx-auto text-indigo-500 mb-2" />
          <p className="text-gray-700 font-medium">
            Upload documents to compare
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Supports PDF, DOCX, and TXT files
          </p>
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            multiple
          />
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Selected Files</h3>
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div className="flex items-center">
                  <div className="bg-indigo-100 text-indigo-800 font-medium text-xs py-1 px-2 rounded mr-2">
                    {getFileIcon(file)}
                  </div>
                  <span className="text-gray-700 truncate max-w-xs">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <button
        onClick={handleSubmit}
        disabled={loading || files.length !== 2}
        className={`w-full py-3 rounded-md text-white font-medium flex items-center justify-center ${
          loading || files.length !== 2
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Compare Documents'
        )}
      </button>
    </div>
  );
};

export default FileUpload;