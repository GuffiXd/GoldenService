import React from "react";
import { motion as Motion } from "framer-motion";
import { Shield, Wrench, Sparkles, CheckCircle } from "lucide-react";

const API_URL = "http://localhost:5000";

function WhyChooseUs() {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Возврат удвоенной стоимости",
      description: "Если товар окажется бракованным — мы вернём вам двойную стоимость. Без вопросов.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Монтаж под ключ",
      description: "Профессиональная установка любой сложности — в удобное для вас время и место.",
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Брендирование продукта",
      description: "Нанесём ваш логотип любой сложности — сделаем замки эксклюзивными для вашего бренда.",
      gradient: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Фоновые частицы */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-indigo-400/30 rounded-full animate-float-slow"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + i * 8}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${18 + i * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Левая часть — 3D изображение */}
          <Motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative group">
              {/* Градиентный блик */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl blur-3xl group-hover:blur-xl transition-all duration-700" />
              
              {/* Основное изображение */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-700 group-hover:-translate-y-3 group-hover:scale-[1.02]">
                <img
                  src={`${API_URL}/images/wholesale-images/WhyChooseUs.webp`}
                  alt="Доверие и качество — Golden Soft"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  onError={(e) => (e.target.src = "/images/fallback-partner.webp")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Плашка "Доверие" */}
                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-xl">
                  <p className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                    100% доверие
                  </p>
                </div>
              </div>
            </div>
          </Motion.div>

          {/* Правая часть — преимущества */}
          <div className="order-1 lg:order-2 space-y-12">
            {/* Заголовок */}
            <Motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-indigo-600 font-bold text-xl tracking-wider uppercase mb-3">
                Почему нас выбирают
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                Мы не просто продаём замки
              </h2>
              <div className="w-40 h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mt-6" />
            </Motion.div>

            {/* Список преимуществ */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <Motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  className="group flex items-start gap-6"
                >
                  {/* Иконка с 3D-градиентом */}
                  <div className={`relative flex-shrink-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl shadow-xl flex items-center justify-center text-white transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                    <div className="relative z-10">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Текст */}
                  <div className="flex-1 pt-2">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Motion.div>
              ))}
            </div>

            {/* Декоративная карточка */}
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-12 p-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-2xl text-white"
            >
              <p className="text-4xl font-black mb-2">5000+</p>
              <p className="text-xl opacity-90">Довольных клиентов по всей России и СНГ</p>
            </Motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;