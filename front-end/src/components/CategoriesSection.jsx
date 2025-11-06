// src/components/CategoriesSection.jsx
import React from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";

const categories = [
  { name: "Накладные электронные замки", slug: "overlay", img: "flat-lock.webp" },
  { name: "Врезные электронные замки", slug: "mortise", img: "mortise-lock.webp" },
  { name: "Замки для квартиры", slug: "apartment", img: "home-lock.webp" },
  { name: "Замки для дома", slug: "home", img: "rooms-lock.webp" },
  { name: "Замки для отелей", slug: "hotel", img: "hotel-lock.webp" },
  { name: "Замки для офиса", slug: "office", img: "office-lock.webp" },
  { name: "Замки для шкафчиков", slug: "cabinet", img: "closet-lock.webp" },
  { name: "Замки для раздевалок", slug: "locker-room", img: "rim-lock.webp" },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Хлебные крошки */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:underline">Главная</Link> /{" "}
          <span className="text-gray-900">Каталог</span>
        </nav>

        {/* Заголовок */}
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Категории
        </h1>

        {/* Сетка */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/catalog/${cat.slug}`}
              className="group block bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* КАРТИНКА — НА ВЕСЬ БЛОК */}
              <div className="relative h-80 w-full">
                <img
                  src={`${API_URL}/images/products/${cat.img}`}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* ПОДПИСЬ */}
              <div className="p-4 text-center">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
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