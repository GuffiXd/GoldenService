import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const API_URL = "http://localhost:5000";

function OurProjectsSlider() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-16">Загрузка...</div>;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
          Наши крупные проекты
        </h2>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="rounded-xl shadow-lg overflow-hidden"
        >
          {projects.map((project) => (
            <SwiperSlide key={project.id}>
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start bg-gray-50 p-8 md:p-12">
                {/* === Левая часть: КАРТИНКА === */}
                <div className="relative">
                  <img
                    src={`${API_URL}${project.image_path}`}
                    alt={project.title}
                    className="w-full h-96 md:h-full object-cover rounded-xl shadow-lg"
                    loading="lazy"
                  />
                </div>

                {/* === Правая часть: ТЕКСТ + ЛОГО === */}
                <div className="flex flex-col justify-start h-full space-y-6">
                  {/* Логотип + Заголовок — на одной линии с верхом картинки */}
                  <div className="flex-col items-start gap-4">
                    {project.logo_path && (
                      <img
                        src={`${API_URL}${project.logo_path}`}
                        alt={`${project.title} logo`}
                        className="w-20 h-20 object-contain flex-shrink-0"
                      />
                    )}
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                      {project.title}
                    </h3>
                  </div>

                  {/* Список */}
                  <ul className="space-y-3">
                    {project.description.split("\n").map((line, i) => {
                      const text = line.replace("• ", "").trim();
                      if (!text) return null;
                      return (
                        <li key={i} className="flex items-start gap-3 text-gray-700">
                          <span className="text-base leading-relaxed">{text}</span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Бюджет */}
                  <p className="text-xl md:text-2xl font-semibold text-gray-900 mt-auto">
                    Бюджет – <span className="text-blue-600">{project.budget}</span>
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default OurProjectsSlider;