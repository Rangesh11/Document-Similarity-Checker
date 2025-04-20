import React, { useState } from "react";
import axios from "axios";

export default function FileUpload({ setResult, setLoading }) {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file1 || !file2) {
      alert("Please upload two files.");
      return;
    }

    const formData = new FormData();
    formData.append("files", file1);  // Append the first file
    formData.append("files", file2);  // Append the second file

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/compare", formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // Set correct content type for file upload
        },
      });

      console.log(response.data);

      setResult(response.data);
    } catch (err) {
      console.error("Error comparing files:", err);  // Log detailed error
      alert("Error comparing files.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Upload Two Files</h2>
      
      <input
        type="file"
        onChange={handleFile1Change}
        className="mb-4 w-full"
      />
      <input
        type="file"
        onChange={handleFile2Change}
        className="mb-4 w-full"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Compare
      </button>
    </div>
  );
}
