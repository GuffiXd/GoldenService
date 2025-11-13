// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Main from "./pages/Main.jsx";
import Wholesale from "./pages/Wholesale.jsx";
import About from "./pages/About.jsx";
import Catalog from "./pages/Catalog.jsx";

// Компонент для скролла вверх при смене маршрута
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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