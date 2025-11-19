import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion as Motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
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

  if (loading) {
    return (
      <section className="py-32 bg-gradient-to-b from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-20 h-20 mx-auto border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-8 text-2xl font-medium text-gray-600">
            Загружаем проекты...
          </p>
        </div>
      </section>
    );
  }

  if (!projects.length) return null;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-indigo-300/20 rounded-full animate-float-slow"
            style={{
              left: `${10 + i * 11}%`,
              top: `${20 + i * 9}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${22 + i * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 font-bold text-sm tracking-wider uppercase rounded-full mb-6">
            Наши проекты
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
            Крупные объекты,
            <br className="hidden md:block" /> которые мы оснастили
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto mt-8" />
        </Motion.div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            loop={projects.length > 1}
            autoplay={{ delay: 7000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={{
              prevEl: ".swiper-button-prev-custom",
              nextEl: ".swiper-button-next-custom",
            }}
            className="our-projects-swiper"
          >
            {projects.map((project, idx) => (
              <SwiperSlide key={project.id}>
                <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
                  <Motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative order-2 lg:order-1"
                  >
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                      <img
                        src={`${API_URL}${project.image_path}`}
                        alt={project.title}
                        className="w-full aspect-[4/3] md:aspect-auto md:h-[520px] object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="inline-block bg-white/95 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-xl">
                          <p className="text-3xl font-black text-indigo-600">
                            {project.budget}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Motion.div>

                  <Motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8 order-1 lg:order-2"
                  >
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                      {project.title}
                    </h3>

                    <ul className="space-y-5">
                      {project.description
                        .split("\n")
                        .map((line) => line.replace("•", "").trim())
                        .filter(Boolean)
                        .map((item, i) => (
                          <Motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-4 text-lg text-gray-700"
                          >
                            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{item}</span>
                          </Motion.li>
                        ))}
                    </ul>

                    <div className="pt-6">
                      <span className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full shadow-xl">
                        Проект {idx + 1} из {projects.length}
                      </span>
                    </div>
                  </Motion.div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-button-prev-custom absolute left-[-80px] top-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <ArrowLeft className="w-14 h-14 text-indigo-600 hover:text-indigo-800 transition-colors" />
          </div>
          <div className="swiper-button-next-custom absolute right-[-80px] top-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <ArrowRight className="w-14 h-14 text-indigo-600 hover:text-indigo-800 transition-colors" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurProjectsSlider;
