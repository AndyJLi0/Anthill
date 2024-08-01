// src/components/TestResults.js
import React, { useEffect, useState } from 'react';

const TestResultsAnthill = () => {
  const [testResults, setTestResults] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await fetch('/test-results.txt'); // Adjust the path as necessary
        if (!response.ok) {
          throw new Error('response did something weird');
        }
        const text = await response.text();
        setTestResults(text);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Test Results</h1>
      <pre>{testResults}</pre> 
    </div>
  );
};

export { TestResultsAnthill };
