import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function PopularProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <section className="py-20 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-12 bg-gray-200 rounded-xl mb-12 mx-auto w-64 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl shadow-lg animate-pulse h-96"
              >
                <div className="h-64 bg-gray-200 rounded-t-3xl" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-indigo-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Заголовок */}
        <h2 className="animate-fade-in text-center text-4xl md:text-5xl font-black text-gray-900 mb-16 tracking-tight">
          Популярные{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            продукты
          </span>
        </h2>

        {/* Сетка */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
              >
                {/* Изображение */}
                <div className="relative h-64 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img
                    src={`${API_URL}${product.image_path}`}
                    alt={product.name}
                    className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Статус */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        product.in_stock ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-bold ${
                        product.in_stock ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {product.in_stock ? "В наличии" : "Нет в наличии"}
                    </span>
                  </div>

                  {/* SALE */}
                  {product.price_with_discount && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        SALE
                      </span>
                    </div>
                  )}
                </div>

                {/* Текст */}
                <div className="p-6 bg-gradient-to-t from-gray-50 to-transparent">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-gray-900">
                      ₽
                      {Number(product.price_with_discount).toLocaleString(
                        "ru-RU"
                      )}
                    </span>
                    {product.price_with_discount && (
                      <span className="text-base text-gray-500 line-through">
                        ₽{Number(product.price).toLocaleString("ru-RU")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Декоративная линия */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
