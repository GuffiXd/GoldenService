// src/components/MissionSection.jsx
import React from "react";

const API_URL = "http://localhost:5000";

function MissionSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* ЛЕВАЯ КОЛОНКА — ТЕКСТ */}
          <div className="space-y-6">
            <div>
              <p className="text-[#4295E4] text-xl font-medium tracking-wider">
                НАША МИССИЯ
              </p>
              <div className="w-40 h-1 bg-[#4295E4] rounded-full mt-2"></div>
            </div>

            <blockquote className="relative pl-10">
              <svg
                className="absolute left-0 top-0 w-8 h-8 text-[#4295E4] opacity-30"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M9.563 8.625C8.375 8.625 7.313 8.875 6.375 9.375 5.438 9.875 4.625 10.563 3.938 11.438 3.25 12.313 2.875 13.313 2.813 14.438H8.938C8.938 13.688 9.125 13.063 9.5 12.563 9.875 12.063 10.375 11.813 11 11.813V8.625H9.563ZM20.563 8.625C19.375 8.625 18.313 8.875 17.375 9.375 16.438 9.875 15.625 10.563 14.938 11.438 14.25 12.313 13.875 13.313 13.813 14.438H19.938C19.938 13.688 20.125 13.063 20.5 12.563 20.875 12.063 21.375 11.813 22 11.813V8.625H20.563Z" />
              </svg>

              <p className="text-lg text-gray-700 italic leading-relaxed">
                Мы создаём надёжные и инновационные системы доступа, которые
                делают жизнь безопаснее и удобнее. Наша цель — обеспечить
                каждому клиенту контроль над пространством, где бы он ни
                находился: в отеле, офисе или дома.
              </p>
            </blockquote>
          </div>

          {/* ПРАВАЯ КОЛОНКА — ИЗОБРАЖЕНИЯ */}
          <div className="relative">
            {/* ОСНОВНОЕ ИЗОБРАЖЕНИЕ */}
            <div className="relative rounded-2xl overflow-hidden z-10">
              <img
                src={`${API_URL}/images/all/about-photo1.webp`}
                alt="Сотрудник на производстве"
                className="w-full h-full object-cover"
              />
            </div>

            {/* МАЛЕНЬКОЕ ИЗОБРАЖЕНИЕ — С БЕЛОЙ ПОЛОСОЙ */}
            <div className="absolute -bottom-8 -left-14 w-64 h-80 overflow-hidden z-20 rounded-2xl bg-white pt-2">
              <div className="w-full h-full rounded-2xl overflow-hidden">
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
