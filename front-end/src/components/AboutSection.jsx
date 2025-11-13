// src/components/AboutSection.jsx
import React from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";

function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Хлебные крошки */}
        <nav className="text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600 transition">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">О нас</span>
        </nav>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* ЛЕВАЯ КОЛОНКА — ВИДЕО */}
          <div className="relative">
            {/* ВИДЕО — БЕСКОНЕЧНЫЙ АВТОПЛЕЙ */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg z-20">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={`${API_URL}/images/all/about.png`}
              >
                <source
                  src={`${API_URL}/images/video/about-video.mp4`}
                  type="video/mp4"
                />
                Ваш браузер не поддерживает видео.
              </video>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА — ТЕКСТ */}
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-[#4295E4] text-xl font-medium tracking-wider">
                О НАС
              </p>
              <div className="w-16 h-1 bg-[#4295E4] rounded-full"></div>
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Компания <span className="text-[#4295E4]">Golden Soft</span>
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Компания <span className="font-medium">Golden Soft</span> —
              ведущий российский производитель электронных замков для отелей,
              офисов, квартир и шкафчиков. Мы разрабатываем и выпускаем
              современные системы доступа с 2015 года, объединяя передовые
              технологии и надёжность.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Наши замки установлены в более чем 500 отелях, 300 офисах и
              тысячах частных домах по всей России и СНГ. Мы предлагаем решения
              под ключ: от биометрических замков с распознаванием лица до
              компактных RFID-систем для фитнес-клубов. Все продукты
              производятся на собственном заводе с многоуровневым контролем
              качества.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
