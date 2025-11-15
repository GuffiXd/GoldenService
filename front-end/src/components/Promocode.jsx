import React, { useState } from "react";
import { X, Phone, Copy } from "lucide-react";

function Promocode() {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText("ZAMOK");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center md:justify-between h-12 relative">
          {/* Центральный текст */}
          <div className="flex items-center gap-3 text-sm md:text-base font-medium">
            <span className="hidden md:inline">Скидка 10% по промокоду</span>
            <span className="md:hidden">Скидка 10%</span>

            <button
              onClick={handleCopy}
              className="group flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <code className="font-bold text-white">ZAMOK</code>
              {copied ? (
                <span className="text-xs text-green-200">Скопировано!</span>
              ) : (
                <Copy className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              )}
            </button>

            <span className="hidden md:inline text-white/80">
              • до <strong>31 декабря 2025</strong>
            </span>
          </div>

          {/* Кнопка закрытия */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-0 md:static p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Декоративная волна снизу */}
      <div className="absolute bottom-0 left-0 right-0 h-2">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white/10"
        >
          <path d="M0,24 Q360,0 720,24 T1440,24 L1440,48 L0,48 Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

export default Promocode;