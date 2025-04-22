import React, { useState, useRef } from 'react';
import { FileText, Upload, X, AlertTriangle, Info, FileIcon, FilePlus } from 'lucide-react';

const FileUpload = ({ files, loading, error, handleFileChange, removeFile, handleSubmit }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const event = { target: { files: e.dataTransfer.files } };
      handleFileChange(event);
    }
  };
  
  const fileTypes = {
    'application/pdf': { color: 'text-red-500', bg: 'bg-red-50' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { color: 'text-blue-500', bg: 'bg-blue-50' },
    'text/plain': { color: 'text-gray-500', bg: 'bg-gray-50' },
  };
  
  const getFileTypeInfo = (fileType) => {
    return fileTypes[fileType] || { color: 'text-indigo-500', bg: 'bg-indigo-50' };
  };
  
  const getFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderFileIcon = (fileType) => {
    const { color } = getFileTypeInfo(fileType);
    return <FileIcon className={`h-5 w-5 ${color}`} />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg mr-3 shadow">
            <Upload className="h-5 w-5 text-white" />
          </div>
          Compare Documents
        </h2>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div 
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all
            ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            multiple
          />
          
          <div className="flex flex-col items-center justify-center">
            <div className={`p-4 rounded-full ${isDragging ? 'bg-indigo-100' : 'bg-indigo-50'} mb-4`}>
              <Upload className="h-12 w-12 text-indigo-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Drag files here or click to browse
            </h3>
            
            <p className="text-gray-500 mb-4">
              Upload two documents you want to compare
            </p>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Select Files
            </button>
            
            <p className="text-xs text-gray-400 mt-4">
              Supported formats: PDF, DOCX, TXT (max 2 files)
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-semibold text-gray-700">Selected Files ({files.length}/2)</h3>
              {files.length === 2 && (
                <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">
                  Ready to compare
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              {files.map((file, index) => {
                const { bg, color } = getFileTypeInfo(file.type);
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-md ${bg} mr-3`}>
                        {renderFileIcon(file.type)}
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium truncate max-w-xs">{file.name}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span className={`w-2 h-2 rounded-full ${color} mr-1`}></span>
                          <span className="mr-2">{file.type.split('/')[1].toUpperCase()}</span>
                          <span>{getFileSize(file.size)}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeFile(index)}
                      className="p-1.5 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition focus:outline-none"
                      aria-label="Remove file"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
              
              {files.length < 2 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-indigo-600 hover:border-indigo-500 transition"
                >
                  <FilePlus className="h-5 w-5 mr-2" />
                  <span>Add another file</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <button
            type="submit"
            disabled={loading || files.length !== 2}
            className={`
              py-3 px-4 rounded-lg text-white font-medium 
              flex items-center justify-center transition-colors shadow-md
              ${loading || files.length !== 2
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}
            `}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                Processing Documents...
              </>
            ) : (
              'Compare Documents'
            )}
          </button>
          
          {files.length !== 2 && !loading && (
            <p className="text-xs text-center text-gray-500">
              <Info className="h-3 w-3 inline-block mr-1" />
              Please select exactly two files to compare
            </p>
          )}
        </div>
      </form>
      
      <div className="mt-8 p-5 bg-indigo-50 rounded-lg">
        <h3 className="text-lg font-semibold text-indigo-700 mb-3 flex items-center">
          <Info className="h-5 w-5 mr-2" />
          How It Works
        </h3>
        <ol className="space-y-3 text-gray-700 ml-6 list-decimal">
          <li className="pl-2">Upload two documents you want to compare (PDF, DOCX, or TXT)</li>
          <li className="pl-2">Our AI analyzes the content for similarities and patterns</li>
          <li className="pl-2">Review detailed comparison results with highlighted matching sections</li>
          <li className="pl-2">See similarity scores and potential content duplication indicators</li>
        </ol>
      </div>
    </div>
  );
};

export default FileUpload;