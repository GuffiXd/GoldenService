import React from "react";
import { Link } from "react-router-dom";
import AddToCartBtn from "../ui/AddToCartBtn";

const API_URL = "http://localhost:5000";

function PromoBanner() {
  // Главный акционный товар (можно вынести в API позже)
  const promoLock = {
    id: 2,
    name: "Golden Soft Biometric",
    price_with_discount: 33900,
    price: 35900,
    image_path: "/images/products/rim-lock.webp", // ← поставь своё лучшее фото
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-20">
      {/* Фон с лёгким шумом */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%226%22 height=%226%22 viewBox=%220 0 6 6%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M0 0h6v6H0z%22/%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* === ЛЕВАЯ ЧАСТЬ: ТЕКСТ + КНОПКА === */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-widest font-semibold text-pink-300">
                Лимитированное предложение
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                {promoLock.name}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-lg">
                Биометрический замок премиум-класса с распознаванием лица и Wi-Fi
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-white">
                ₽{promoLock.price_with_discount.toLocaleString()}
                </span>
                <span className="text-2xl line-through text-gray-400">
                ₽{promoLock.price.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <AddToCartBtn
                productId={promoLock.id}
                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl text-lg"
              >
                Купить сейчас
              </AddToCartBtn>

              <Link
                to="/catalog"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md text-white font-semibold py-4 px-8 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Посмотреть каталог
              </Link>
            </div>

            <p className="text-sm text-gray-300">
              Доставка по всей России • Гарантия 3 года • Монтаж под ключ
            </p>
          </div>

          {/* === ПРАВАЯ ЧАСТЬ: ФОТО === */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Декоративный круг */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-orange-600 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Фото */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-full p-8 shadow-2xl">
                <img
                  src={`${API_URL}${promoLock.image_path}`}
                  alt={promoLock.name}
                  className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
                  loading="lazy"
                />
              </div>

              {/* Плавающая метка */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-gray-900 font-bold px-4 py-2 rounded-full shadow-lg text-sm uppercase tracking-wider animate-pulse">
                −21%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Декоративные волны снизу */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-32 text-white"
        >
          <path
            d="M0,0 C360,120 1080,0 1440,80 L1440,120 L0,120 Z"
            fill="currentColor"
            opacity="0.1"
          />
        </svg>
      </div>
    </section>
  );
}

export default PromoBanner;