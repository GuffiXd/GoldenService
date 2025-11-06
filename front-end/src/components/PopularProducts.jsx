import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";

function PopularProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загружаем популярные замки
  useEffect(() => {
    fetch(`${API_URL}/api/locks/popular`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки популярных замков:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-600">
        Загрузка популярных продуктов...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        Популярные продукты пока не добавлены.
      </div>
    );
  }

  // Локальные функции (временно, потом — на бэкенд)
  const toggleFavorite = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, is_favorite: !p.is_favorite } : p
      )
    );
  };

  const toggleCart = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, is_in_cart: !p.is_in_cart } : p
      )
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Заголовок + стрелки */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Наши популярные продукты
          </h2>
          <div className="flex gap-3">
            <button
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
              aria-label="Предыдущий"
            >
              ←
            </button>
            <button
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
              aria-label="Следующий"
            >
              →
            </button>
          </div>
        </div>

        {/* Сетка товаров */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Фото */}
              <div className="relative h-64 bg-gray-50 p-4">
                <img
                  src={`${API_URL}${product.image_path}`}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform group-hover:scale-105"
                  loading="lazy"
                />

                {/* Иконка избранного */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(product.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition"
                  aria-label="Добавить в избранное"
                >
                  <svg
                    className={`w-5 h-5 transition-colors ${
                      product.is_favorite
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400"
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>

                {/* SALE */}
                {product.price_with_discount && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </span>
                )}
              </div>

              {/* Контент */}
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-3">
                  {product.name}
                </h3>

                {/* Цена */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {Number(product.price).toLocaleString("ru-RU")} ₽
                  </span>
                  {product.price_with_discount && (
                    <span className="text-sm text-gray-500 line-through">
                      {Number(product.price_with_discount).toLocaleString("ru-RU")} ₽
                    </span>
                  )}
                </div>

                {/* Кнопки */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(product.id);
                    }}
                    className={`flex-1 py-2 px-3 rounded text-xs font-medium transition ${
                      product.is_favorite
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {product.is_favorite ? "В избранном" : "В избранное"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleCart(product.id);
                    }}
                    className={`flex-1 py-2 px-3 rounded text-xs font-medium transition ${
                      product.is_in_cart
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {product.is_in_cart ? "В корзине" : "В корзину"}
                  </button>
                </div>

                {/* Подробнее */}
                <Link
                  to={`/product/${product.id}`}
                  className="block w-full text-center bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularProducts;