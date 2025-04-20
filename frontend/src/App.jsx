import React, { useState } from "react";
import FileUpload from "./components/FileUpload";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <FileUpload setResult={setResult} setLoading={setLoading} />

      {loading && <p className="mt-4 text-blue-600 font-semibold">Processing...</p>}

      {result && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md max-w-xl w-full">
          <h3 className="text-lg font-bold text-green-700">Results:</h3>
          <p><strong>Similarity Score:</strong> {result.score}</p>
          <p><strong>Plagiarism:</strong> {result.plagiarism ? "Yes" : "No"}</p>
          <div className="mt-2">
            <strong>Common Phrases:</strong>
            <ul className="list-disc ml-6">
              {result.commonPhrases.map((phrase, idx) => (
                <li key={idx}>{phrase}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
