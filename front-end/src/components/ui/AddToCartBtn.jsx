import React, { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";

function AddToCartBtn({ onClick, disabled = false }) {
  const [added, setAdded] = useState(false);

  const handleClick = (e) => {
    if (disabled) return;

    setAdded(true);
    onClick?.(e);

    // Сброс анимации через 1.5 сек
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        group relative overflow-hidden
        flex items-center justify-center gap-2
        px-6 py-3 rounded-2xl font-bold text-white text-base
        transition-all duration-300 transform
        ${disabled 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105"
        }
      `}
    >
      {/* Анимация "добавлено" */}
      <span
        className={`
          absolute inset-0 flex items-center justify-center
          bg-green-500 text-white rounded-2xl
          transition-transform duration-500 ease-out
          ${added ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Check className="w-5 h-5" />
        <span className="ml-2">Добавлено!</span>
      </span>

      {/* Основной текст */}
      <span className={`flex items-center gap-2 transition-opacity duration-300 ${added ? "opacity-0" : "opacity-100"}`}>
        <ShoppingCart className="w-5 h-5 group-hover:animate-pulse" />
        Добавить в корзину
      </span>
    </button>
  );
}

export default AddToCartBtn;