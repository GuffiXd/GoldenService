import React from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";

function Categories() {
  const categories = [
    {
      title: "Для отелей",
      img: "/images/hotel.jpg",
      link: "/catalog/hotels",
    },
    {
      title: "Для шкафчиков",
      img: "/images/cabinet-lock.jpg",
      link: "/catalog/cabinets",
    },
    {
      title: "Для офисов",
      img: "/images/office-lock.jpg",
      link: "/catalog/offices",
    },
    {
      title: "Замки для дома",
      img: "/images/home-lock.jpg",
      link: "/catalog/home",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Заголовок */}
        <h2 className="text-center text-3xl md:text-4xl font-semibold text-gray-900 mb-14">
          Категории
        </h2>

        {/* Сетка категорий */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="relative h-80 rounded-lg overflow-hidden group cursor-pointer"
              style={{
                backgroundImage: `url(${API_URL}${cat.img})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#f9fafb",
              }}
            >
              {/* Полупрозрачный оверлей */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Контент */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-semibold text-white mb-3 drop-shadow-md">
                  {cat.title}
                </h3>
                <Link
                  to={cat.link}
                  className="inline-block border border-white text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-white hover:text-gray-800 transition-all duration-300"
                >
                  Перейти
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Кнопка "Все категории" */}
        <div className="flex justify-center mt-14">
          <Link
            to="/catalog"
            className="bg-[#4295E4] text-white px-10 py-3 rounded-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Все категории
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Categories;