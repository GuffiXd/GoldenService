// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-9xl font-black text-indigo-600">404</h1>
        <p className="text-2xl font-bold text-gray-800 mt-4">Страница не найдена</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:scale-105 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}