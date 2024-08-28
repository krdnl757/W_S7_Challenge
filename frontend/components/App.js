import React from 'react';

import {Home} from './Home';
import Form from './Form';
import { NavLink, Route, Routes } from 'react-router-dom';

function App() {
  return (
  
      <div id="app">
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/order">Order</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<Form />} />
        </Routes>
      </div>
    
  );
}

export default App;
