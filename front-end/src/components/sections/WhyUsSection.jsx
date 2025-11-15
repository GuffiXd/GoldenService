import React from "react";
import { Shield, Palette, Package, CheckCircle } from "lucide-react";

const API_URL = "http://localhost:5000";

function WhyUs() {
  const items = [
    {
      icon: Shield,
      title: "Возврат стоимости каждого замка в случае брака",
      desc: "Полная компенсация без вопросов",
    },
    {
      icon: Palette,
      title: "Наносим ваш логотип на продукт",
      desc: "Брендирование под ключ",
    },
    {
      icon: Package,
      title: "Только проверенный товар",
      desc: "Качество — наш приоритет",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Заголовок */}
        <h2 className="text-center text-4xl md:text-5xl font-black text-gray-900 mb-16 tracking-tight">
          Почему <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">GoldenService</span>?
        </h2>

        {/* Блоки */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Декоративный градиентный круг */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-opacity"></div>

                {/* Иконка */}
                <div className="relative mb-6 w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Текст */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {item.title}
                </h3>
                <p className="text-base text-gray-600 text-center leading-relaxed">
                  {item.desc}
                </p>

                {/* Декоративная линия снизу */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyUs;