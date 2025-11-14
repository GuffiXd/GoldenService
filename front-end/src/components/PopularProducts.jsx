// src/components/PopularProducts.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

function PopularProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ← ДЛЯ ПРОГРАММНОГО ПЕРЕХОДА

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

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Заголовок */}
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          Наши популярные продукты
        </h2>

        {/* Сетка товаров */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)} // ← КЛИК ПО ВСЕЙ КАРТОЧКЕ
            >
              {/* Верхняя часть с изображением */}
              <div className="relative bg-white h-64 flex items-center justify-center p-4">
                <img
                  src={`${API_URL}${product.image_path}`}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />

                {/* В НАЛИЧИИ — СЛЕВА СВЕРХУ */}
                <div className="absolute top-3 left-3 flex items-center gap-1 text-xs">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      product.in_stock ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      product.in_stock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.in_stock ? "В наличии" : "Нет в наличии"}
                  </span>
                </div>

                {/* SALE — СПРАВА СВЕРХУ */}
                <div className="absolute top-3 right-3">
                  {product.price_with_discount && (
                    <span className="text-black border text-xs font-bold px-2 py-1 rounded bg-gray-200">
                      SALE
                    </span>
                  )}
                </div>
              </div>

              {/* Название и цена */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {Number(product.price).toLocaleString("ru-RU")} ₽
                  </span>
                  {product.price_with_discount && (
                    <span className="text-sm text-gray-500 line-through">
                      {Number(product.price_with_discount).toLocaleString(
                        "ru-RU"
                      )}{" "}
                      ₽
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularProducts;