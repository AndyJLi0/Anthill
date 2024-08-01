import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from './Components/Home.js';
import { Login } from './Components/Login.js';
import QuestionDetail from './Components/QuestionDetail.js';
import { TestResultsServer } from './Components/TestResultsServer.js';
import { TestResultsAnthill } from './Components/TestResultsAnthill.js';


function App() {
    return (
        <div className="wrapper">
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/question/:id" element={<QuestionDetail />} />
                    <Route path="/test-results-server" element={<TestResultsServer />} />
                    <Route path="/test-results-anthill" element={<TestResultsAnthill />} />

                </Routes>
            </Router>
        </div>
    );
}

export default App;