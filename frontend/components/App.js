import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import {Home} from './Home';
import Form from './Form';

function App() {
  return (
    <Router>
      <div id="app">
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/form">Form</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
