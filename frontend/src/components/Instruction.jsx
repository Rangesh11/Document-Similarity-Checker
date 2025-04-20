import React from 'react'

export const Instruction = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
    <h3 className="text-lg font-medium text-gray-800 mb-2">How It Works</h3>
    <ol className="list-decimal pl-5 space-y-2 text-gray-700">
      <li>Upload two documents you want to compare (PDF, DOCX, or TXT)</li>
      <li>Our AI will analyze the content for similarities</li>
      <li>View a detailed comparison with highlighted matching sections</li>
      <li>See similarity scores and potential plagiarism indicators</li>
    </ol>
  </div>
  )
}
