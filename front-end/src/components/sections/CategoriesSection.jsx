import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка загрузки категорий:", err);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-12 bg-gray-200 rounded-xl mb-12 mx-auto w-48 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-md animate-pulse h-80">
                <div className="h-64 bg-gray-200 rounded-t-3xl" />
                <div className="h-12 bg-gray-200 rounded-b-3xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="animate-fade-in text-center text-4xl md:text-5xl font-black text-gray-900 mb-16 tracking-tight">
          Категории
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {categories.map((cat, index) => (
            <div
              key={cat.slug}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >

              <Link
                to={`/catalog?category=${cat.id}`}
                className="group block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative h-64 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img
                    src={`${API_URL}${cat.image_path}`}
                    alt={cat.name}
                    className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="p-6 text-center bg-gradient-to-t from-gray-50 to-transparent">
                  <p className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>


        <div className="mt-16 text-center">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Смотреть все
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}