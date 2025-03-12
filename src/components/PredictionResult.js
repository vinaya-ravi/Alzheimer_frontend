import React from 'react';

const PredictionResult = ({ result }) => {
  return (
    <div className="mt-4">
      <h2>Prediction Result</h2>
      <p><strong>Class:</strong> {result.class}</p>
      <p><strong>Confidence:</strong> {result.confidence}%</p>
    </div>
  );
};

export default PredictionResult;
