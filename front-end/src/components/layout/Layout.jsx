// src/components/layout/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Promocode from "./Promocode";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50/30 to-white">
      <Promocode />
      <Header />
      <main className="flex-1">
        <Outlet /> {/* Здесь будут все страницы */}
      </main>
      <Footer />
    </div>
  );
}