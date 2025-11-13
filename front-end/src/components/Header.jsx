// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const API_URL = "http://localhost:5000";

function Header() {
  const [categories, setCategories] = useState([]);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Загружаем категории с бэкенда
  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки категорий");
        return res.json();
      })
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <header className="flex justify-around items-center p-4 border pl-20 pr-20 text-xl bg-white shadow-sm">
      {/* Логотип */}
      <div className="logo">
        <img
          src={`${API_URL}/images/icons/logo-header.svg`}
          alt="Golden Soft"
          className="h-10"
        />
      </div>

      {/* Навигация */}
      <nav className="relative">
        <ul className="flex space-x-10">
          {/* Главная */}
          <li>
            <NavLink
              to="/main"
              className="hover:underline transition"
            >
              Главная
            </NavLink>
          </li>

          {/* КАТАЛОГ С ВЫПАДАЮЩИМ МЕНЮ */}
          <li
            className="relative"
            onMouseEnter={() => setIsCatalogOpen(true)}
            onMouseLeave={() => setIsCatalogOpen(false)}
          >
            <NavLink
              to="/catalog"
              className="hover:underline transition flex items-center gap-1"

            >
              Каталог
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isCatalogOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </NavLink>

            {/* ВЫПАДАЮЩЕЕ МЕНЮ */}
            {isCatalogOpen && (
              <div
                className="absolute top-full left-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                onMouseEnter={() => setIsCatalogOpen(true)}
                onMouseLeave={() => setIsCatalogOpen(false)}
              >
                <ul className="py-3">
                  {categories.map((cat) => (
                    <li key={cat.slug}>
                      <NavLink
                        to={`/catalog/${cat.slug}`}
                        className="block px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:underlin hover:font-semibold transition"
                        onClick={() => setIsCatalogOpen(false)}
                      >
                        {cat.name}
                      </NavLink>
                    </li>
                  ))}

                  {/* КНОПКА "СМОТРЕТЬ ВСЕ" */}
                  <li className=" mt-2 pt-3 px-3">
                    <NavLink
                      to="/catalog"
                      className="block px-5 py-2 text-sm font-medium text-white bg-[#4295E4] hover:bg-[#2f7acc] transition"
                      onClick={() => setIsCatalogOpen(false)}
                    >
                      Смотреть все
                    </NavLink>
                  </li>
                </ul>
              </div>
            )}
          </li>

          {/* Оптовая продажа */}
          <li>
            <NavLink
              to="/wholesale"
              className="hover:underline transition"

            >
              Оптовая продажа
            </NavLink>
          </li>

          {/* О нас */}
          <li>
            <NavLink
              to="/about"
              className="hover:underline transition"
            >
              О нас
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Телефон и иконки */}
      <div className="number flex items-center space-x- gap-5">
        <img
          src={`${API_URL}/images/icons/phone-header.svg`}
          alt="call"
          className="h-6"
        />
        <h1 className="text-xl">+7 (966) 55 88 499</h1>
        <img
          src={`${API_URL}/images/icons/heart-header.svg`}
          alt="heart"
          className=""
        />
        <img src={`${API_URL}/images/icons/cart-header.svg`} alt="cart" className="" />
      </div>
    </header>
  );
}

export default Header;
