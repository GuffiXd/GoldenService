// src/App.jsx — БЕЗ AuthProvider!
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Main from "./pages/Main";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Wholesale from "./pages/Wholesale";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/wholesale" element={<Wholesale />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile/*" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}