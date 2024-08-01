import React, { useEffect, useState } from 'react';

const TestResultsServer = () => {
    const [testResults, setTestResults] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/test-results-server')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`response error: ${response.status}`);
                }
                return response.text();  // Fetch the response as text
            })
            .then(data => setTestResults(data))
            .catch(error => console.error('error fetching test results:', error));
    }, []);

    if (!testResults) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Test Results</h1>
            <pre>{testResults}</pre> 
        </div>
    );
};

export { TestResultsServer };