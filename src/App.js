import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Stretch from './pages/Stretch';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stretch" element={<Stretch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
