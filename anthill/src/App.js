import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Home } from './Components/Home';
import { Login } from './Components/Login';

function App() {
  return (
    <div className="wrapper">
      <h1>Anthill</h1>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
