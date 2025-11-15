import React from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";

function AboutSection() {
  return (
    <section className="relative bg-gradient-to-b from-white via-indigo-50 to-white py-20 overflow-hidden">
      {/* Фоновые частицы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-indigo-300/20 rounded-full animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${18 + i * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Хлебные крошки */}
        <nav className="text-sm text-gray-600 mb-10 animate-fade-in">
          <Link to="/" className="hover:text-indigo-600 transition-colors duration-300">
            Главная
          </Link>
          <span className="mx-2 text-gray-400">→</span>
          <span className="text-indigo-600 font-medium">О нас</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* ЛЕВАЯ КОЛОНКА — ВИДЕО С 3D-ЭФФЕКТОМ */}
          <div className="relative group animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="absolute -inset-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-[1.01]">
              <video
                className="w-full h-full object-cover rounded-3xl"
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
          <div className="space-y-7">
            {/* Заголовок */}
            <div className="space-y-1 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <p className="text-indigo-600 text-xl font-bold tracking-wider uppercase">
                О компании
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
              <h2 className="text-4xl md:text-4xl font-black text-gray-900 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Golden Soft
                </span>
                <br />
                — умные замки с 2015 года
              </h2>
            </div>

            {/* Описание */}
            <div className="space-y-5 text-gray-700 text-lg leading-relaxed">
              <p className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                Мы — <strong className="text-indigo-600">ведущий российский производитель</strong> электронных замков для отелей, офисов, квартир и шкафчиков.
              </p>
            </div>

            {/* Декоративная карточка */}
            <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-inner animate-fade-in" style={{ animationDelay: "0.7s" }}>
              <p className="text-2xl font-black text-indigo-600">10 лет</p>
              <p className="text-gray-700">на рынке умных систем доступа</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;