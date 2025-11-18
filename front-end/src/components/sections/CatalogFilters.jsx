// src/components/sections/CatalogFilters.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function CatalogFilters() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const currentCategory = params.get("category") || "";
  const currentMinPrice = params.get("min_price") || "";
  const currentMaxPrice = params.get("max_price") || "";

  useEffect(() => {
    fetch(`${API_URL}/api/categories/with-count`)
      .then((res) => res.json())
      .then((data) => setCategories(data || []))
      .catch((err) => {
        console.error(err);
        setCategories([]);
      });
  }, []);

  // Универсальная функция — клик по любому фильтру (снимает при повторном клике)
  const toggleFilter = (key, value) => {
    const newParams = new URLSearchParams(location.search);

    // Если значение уже активно — снимаем его
    if (newParams.get(key) === value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    newParams.set("page", "1");
    navigate(`/catalog?${newParams.toString()}`);
  };

  // Специально для ценовых диапазонов
  const setPriceRange = (min = "", max = "") => {
    const newParams = new URLSearchParams(location.search);
    newParams.delete("min_price");
    newParams.delete("max_price");

    if (min) newParams.set("min_price", min);
    if (max) newParams.set("max_price", max);

    newParams.set("page", "1");
    navigate(`/catalog?${newParams.toString()}`);
  };

  // Проверяем, активен ли ценовой диапазон
  const isPriceRangeActive = (min, max) => {
    return currentMinPrice === min && currentMaxPrice === max;
  };

  return (
    <div className="space-y-10">
      {/* КАТЕГОРИИ — теперь с отменой при повторном клике */}
      <div>
        <h3 className="text-xl font-black text-gray-900 mb-6">Категории</h3>
        <div className="space-y-3">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition"
            >
              <input
                type="radio"
                name="category"
                value={cat.id}
                checked={currentCategory === String(cat.id)}
                onChange={() => toggleFilter("category", String(cat.id))}
                className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="flex-1 text-gray-700 font-medium">
                {cat.name}
              </span>
              <span className="text-gray-500 font-bold">({cat.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* ЦЕНА — теперь отмечается даже если товаров 0 */}
      <div>
        <h3 className="text-xl font-black text-gray-900 mb-6">Цена</h3>
        <div className="space-y-3">
          {[
            { label: "До 10 000 ₽", max: "10000" },
            { label: "10 000 – 30 000 ₽", min: "10000", max: "30000" },
            { label: "30 000 – 60 000 ₽", min: "30000", max: "60000" },
            { label: "От 60 000 ₽", min: "60000" },
          ].map((range) => {
            const active = isPriceRangeActive(range.min || "", range.max || "");

            return (
              <label
                key={range.label}
                className={`flex items-center gap-4 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition ${
                  active ? "bg-indigo-50" : ""
                }`}
              >
                <input
                  type="radio"
                  name="price"
                  checked={active}
                  onChange={() => {
                    if (active) {
                      // Если уже активно — снимаем фильтр
                      setPriceRange();
                    } else {
                      // Применяем диапазон
                      setPriceRange(range.min, range.max);
                    }
                  }}
                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                />
                <span className={`font-medium ${active ? "text-indigo-700" : "text-gray-700"}`}>
                  {range.label}
                </span>
                {active && <span className="ml-auto text-xs text-indigo-600">✓</span>}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}