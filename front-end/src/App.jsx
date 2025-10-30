// src/App.jsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from '../src/pages/Main.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} /> {/* Начальный маршрут */}
        <Route path="/main" element={<Main />} />
        <Route path="/catalog" element={<div>Каталог</div>} />
        <Route path="/wholesale" element={<div>Оптовая продажа</div>} />
        <Route path="/about" element={<div>О нас</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;