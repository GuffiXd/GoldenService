import React from "react";
import { motion as Motion } from "framer-motion";

const API_URL = "http://localhost:5000";

function HowWeWork() {
  const steps = [
    {
      number: "01",
      title: "Оформление заявки",
      description:
        "Вы оставляете заявку на сайте или звоните нам — мы сразу берём ваш заказ в работу",
      image: "/images/wholesale-images/HowWeWork1.webp",
    },
    {
      number: "02",
      title: "Согласование деталей",
      description:
        "Консультируем, подбираем оптимальное решение, фиксируем цену и время",
      image: "/images/wholesale-images/HowWeWork2.webp",
    },
    {
      number: "03",
      title: "Доставка и монтаж",
      description:
        "Специалист приезжает точно в срок, устанавливает замки под ключ",
      image: "/images/wholesale-images/HowWeWork3.webp",
    },
  ];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-white via-indigo-50/50 to-white">
      {/* Фоновые частицы */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-indigo-400/20 rounded-full animate-float-slow"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + i * 10}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${20 + i * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Заголовок */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-indigo-600 font-bold text-xl tracking-wider uppercase mb-3">
            Процесс работы
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900">
            Как мы работаем
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto mt-6" />
        </Motion.div>

        {/* Карточки шагов */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {steps.map((step, index) => (
            <Motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="group relative"
            >
              {/* 3D-карточка */}
              <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-2xl">

                
                {/* Изображение */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={`${API_URL}${step.image}`}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/images/fallback.webp";
                    }}
                  />
                  
                  {/* Номер шага — 3D */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black text-4xl flex items-center justify-center rounded-full shadow-2xl transform rotate-12 group-hover:rotate-6 transition-transform duration-500">
                    {step.number}
                  </div>
                </div>

                {/* Текст */}
                <div className="p-8 md:p-10 text-center relative z-20">
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            </Motion.div>
          ))}
        </div>


        <div className="flex justify-center mt-12 md:hidden">
          <div className="flex items-center gap-4">
            {steps.map((_, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${i === 0 ? "bg-indigo-600" : "bg-gray-300"}`} />
                {i < 2 && <div className="w-16 h-1 bg-gray-300" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowWeWork;