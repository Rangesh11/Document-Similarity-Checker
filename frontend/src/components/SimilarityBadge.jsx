import React from 'react';

const SimilarityBadge = ({ similarity }) => {
  const getSimilarityColor = (similarity) => {
    const value = parseFloat(similarity);
    if (value >= 0.9) return 'text-red-600 bg-red-100';
    if (value >= 0.7) return 'text-orange-600 bg-orange-100';
    if (value >= 0.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getSimilarityLabel = (similarity) => {
    const value = parseFloat(similarity);
    if (value >= 0.9) return 'Very High';
    if (value >= 0.7) return 'High';
    if (value >= 0.5) return 'Moderate';
    return 'Low';
  };

  return (
    <span className={`text-sm px-2 py-0.5 rounded-full ${getSimilarityColor(similarity)}`}>
      {getSimilarityLabel(similarity)} ({Math.round(parseFloat(similarity) * 100)}%)
    </span>
  );
};

export default SimilarityBadge;