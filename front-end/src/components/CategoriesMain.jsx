// src/components/CategoriesSection.jsx
import React from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";

const categories = [
  { name: "Накладные электронные замки", slug: "overlay", img: "flat-lock.webp" },
  { name: "Врезные электронные замки", slug: "mortise", img: "mortise-lock.webp" },
  { name: "Замки для квартиры", slug: "apartment", img: "home-lock.webp" },
  { name: "Замки для дома", slug: "home", img: "rooms-lock.webp" },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Заголовок */}
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Категории
        </h2>

        {/* Сетка */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/catalog/${cat.slug}`}
              className="group block bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              {/* ФИКСИРОВАННАЯ ВЫСОТА + ЦЕНТР */}
              <div className="h-64 bg-white flex items-center justify-center p-8">
                <img
                  src={`${API_URL}/images/products/${cat.img}`}
                  alt={cat.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Подпись */}
              <div className="p-4 text-center border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 line-clamp-2">
                  {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Кнопка */}
        <div className="mt-12 text-center">
          <Link
            to="/catalog"
            className="inline-block px-8 py-3 bg-[#4295E4] text-white font-medium rounded-md hover:bg-[#2f7acc] transition"
          >
            Смотреть все
          </Link>
        </div>
      </div>
    </section>
  );
}