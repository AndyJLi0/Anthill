import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from './Components/Home';
import { Login } from './Components/Login';
import QuestionDetail from './Components/QuestionDetail';

function App() {
    return (
        <div className="wrapper">
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/question/:id" element={<QuestionDetail />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;