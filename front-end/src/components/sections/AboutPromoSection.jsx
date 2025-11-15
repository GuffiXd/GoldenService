import React from "react";
import { Link } from "react-router-dom";
import { Users, Shield, Clock, Heart, ArrowRight } from "lucide-react";

function AboutPromoSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-indigo-50 py-20 overflow-hidden">
      {/* Фоновые частицы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-indigo-300/20 rounded-full animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${20 + i * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Левая часть — текст */}
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 animate-fade-in">
              Узнайте <span className="text-indigo-600">больше</span> о нас
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Мы — команда профессионалов, создающая умные решения для безопасности с 2021 года
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              {[
                { icon: Users, label: "Команда экспертов", value: "15+" },
                { icon: Shield, label: "Гарантия качества", value: "100%" },
                { icon: Clock, label: "Опыт работы", value: "5 лет" },
                { icon: Heart, label: "Довольных клиентов", value: "5000+" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-white/70 backdrop-blur rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="font-bold text-indigo-600">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Кнопка */}
            <Link
              to="/about"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-pink-500/50 hover:scale-105 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: "0.7s" }}
            >
              Подробнее о компании
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>

          {/* Правая часть — 3D карточка */}
          <div className="flex justify-center md:justify-end animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl transform transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-1">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                  <Users className="w-20 h-20 text-white" />
                </div>
                <h3 className="text-2xl font-black text-center text-gray-900 mb-2">Golden Soft</h3>
                <p className="text-center text-gray-600">С 2021 года делаем мир безопаснее</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutPromoSection;