import React from "react";

const API_URL = "http://localhost:5000";

function MissionSection() {
  return (
    <section className="relative bg-gradient-to-b from-indigo-50 via-white to-purple-50 py-20 overflow-hidden">
      {/* Фоновые частицы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-indigo.lista-400/20 rounded-full animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${22 + i * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* ЛЕВАЯ КОЛОНКА — ТЕКСТ + ЦИТАТА */}
          <div className="space-y-10">
            {/* Заголовок */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <p className="text-indigo-600 text-xl font-bold tracking-wider uppercase">
                Наша миссия
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
            </div>

            {/* Цитата */}
            <blockquote className="relative pl-14 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <svg
                className="absolute left-0 top-2 w-12 h-12 text-indigo-200 opacity-80"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M9.563 8.625C8.375 8.625 7.313 8.875 6.375 9.375 5.438 9.875 4.625 10.563 3.938 11.438 3.25 12.313 2.875 13.313 2.813 14.438H8.938C8.938 13.688 9.125 13.063 9.5 12.563 9.875 12.063 10.375 11.813 11 11.813V8.625H9.563ZM20.563 8.625C19.375 8.625 18.313 8.875 17.375 9.375 16.438 9.875 15.625 10.563 14.938 11.438 14.25 12.313 13.875 13.313 13.813 14.438H19.938C19.938 13.688 20.125 13.063 20.5 12.563 20.875 12.063 21.375 11.813 22 11.813V8.625H20.563Z" />
              </svg>

              <p className="text-xl md:text-2xl text-gray-800 italic leading-relaxed font-medium">
                Мы создаём <span className="text-indigo-600 font-bold">надёжные и инновационные</span> системы доступа, которые делают жизнь безопаснее и удобнее.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Наша цель — обеспечить каждому клиенту контроль над пространством, где бы он ни находился: в отеле, офисе или дома.
              </p>
            </blockquote>

            {/* Декоративная карточка */}
            <div className="mt-8 p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-inner animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <p className="text-3xl font-black text-indigo-600">100%</p>
              <p className="text-gray-700 font-medium">Надёжность и безопасность</p>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА — ИЗОБРАЖЕНИЯ С 3D-ЭФФЕКТОМ */}
          <div className="relative h-[500px] animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {/* ОСНОВНОЕ ИЗОБРАЖЕНИЕ */}
            <div className="absolute top-0 right-0 w-80 h-96 group z-10">
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02]">
                <img
                  src={`${API_URL}/images/all/about-photo1.webp`}
                  alt="Сотрудник на производстве"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* МАЛЕНЬКОЕ ИЗОБРАЖЕНИЕ — С 3D и hover */}
            <div className="absolute -bottom-10 -left-10 w-64 h-80 group z-20">
              <div className="absolute -inset-4 bg-gradient-to-br from-purple-200 to-pink-200 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="relative h-full bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:translate-y-1 group-hover:-rotate-3">
                <img
                  src={`${API_URL}/images/all/about-photo2.webp`}
                  alt="Монтаж замка"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MissionSection;