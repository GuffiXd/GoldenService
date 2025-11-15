import React from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, Users, Shield, Truck } from "lucide-react";

function WholesalePromoSection() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-20 overflow-hidden">
      {/* Фон с частицами */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${15 + i * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Левая часть — текст */}
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-black mb-6 animate-fade-in">
              Хотите заказать <span className="text-yellow-300">оптом</span>?
            </h2>
            <p className="text-xl mb-8 text-white/90 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Специальные цены, гибкие условия и быстрая доставка для дилеров и магазинов
            </p>

            <ul className="space-y-4 mb-10">
              {[
                { icon: Users, text: "От 10 единиц — оптовые цены" },
                { icon: Shield, text: "Гарантия качества на всю партию" },
                { icon: Truck, text: "Доставка по России и СНГ" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 animate-fade-in"
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg">{item.text}</span>
                </li>
              ))}
            </ul>

            {/* Кнопка */}
            <Link
              to="/wholesale"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-pink-500/50 hover:scale-105 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              Перейти к оптовым закупкам
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>

          {/* Правая часть — иллюстрация */}
          <div className="flex justify-center md:justify-end animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="relative">
              <div className="absolute -inset-4 bg-white/10 backdrop-blur-xl rounded-3xl -rotate-6" />
              <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 shadow-2xl rotate-3 hover:rotate-6 transition-transform duration-500">
                <Package className="w-24 h-24 text-white mx-auto" />
                <p className="text-white font-bold text-center mt-4 text-xl">Опт от 10 шт</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WholesalePromoSection;