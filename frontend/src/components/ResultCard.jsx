import React from 'react';

export default function ResultCard({ result }) {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Similarity Result</h2>
      <div className="mb-4">
        <p className="text-lg"><strong>Similarity Score:</strong> <span className="text-blue-500">{result.score}</span></p>
        <p className="text-lg"><strong>Plagiarism Detected:</strong> <span className={result.plagiarism ? "text-red-600" : "text-green-600"}>{result.plagiarism ? 'Yes 🚨' : 'No ✅'}</span></p>
      </div>

      <div>
        <h3 className="font-semibold text-xl text-gray-700 mb-3">Common Phrases:</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
          {result.commonPhrases.length > 0 ? (
            result.commonPhrases.map((phrase, idx) => <li key={idx}>{phrase}</li>)
          ) : (
            <li>No common phrases found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
