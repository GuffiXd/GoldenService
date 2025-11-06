// src/App.jsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from '../src/pages/Main.jsx';
import Wholesale from './pages/Wholesale.jsx';
import About from './pages/About.jsx';
import Catalog from './pages/Catalog.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/main" element={<Main />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/wholesale" element={<Wholesale />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;