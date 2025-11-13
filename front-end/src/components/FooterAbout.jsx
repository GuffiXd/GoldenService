// src/components/AboutFooter.jsx
import React from "react";

const API_URL = "http://localhost:5000";

function AboutFooter() {
  return (
    <footer className="bg-white">
      {/* ВЕРХНЯЯ ЧАСТЬ — ФОРМА + КОНТАКТЫ */}
      <div className="py-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* ЛЕВАЯ ЧАСТЬ — ВОПРОСЫ + ФОРМА */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Остались вопросы?
              </h2>
              <p className="text-gray-600 text-base lg:text-lg max-w-md">
                Если у вас возникли какие-то вопросы по поводу оптовых заказов,
                заполните форму и мы Вам перезвоним.
              </p>

              <form className="space-y-4 max-w-sm">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full h-14 px-5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4295E4] transition"
                />
                <input
                  type="email"
                  placeholder="Ваш Email"
                  className="w-full h-14 px-5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4295E4] transition"
                />
                <button className="w-full h-14 bg-[#4295E4] text-white font-semibold rounded-lg hover:bg-[#2f7acc] transition text-base">
                  Отправить
                </button>
              </form>
            </div>

            {/* ПРАВАЯ ЧАСТЬ — КОНТАКТЫ + ФОТО */}
            <div className="space-y-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Контакты
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Наш Адрес</p>
                  <p className="text-gray-600 leading-relaxed">
                    Россия, Ростов-на-Дону<br />
                    ул. Богачева, 16
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Телефоны</p>
                  <p className="text-gray-600 leading-relaxed">
                    +7 (988) 565 00 38<br />
                    +375 33 662 82 56
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Email</p>
                  <p className="text-gray-600 leading-relaxed">
                    vladpertcev@mail.ru<br />
                    korobko416@gmail.com
                  </p>
                </div>
              </div>

              {/* ФОТО ПРОИЗВОДСТВА */}
              <div className="grid grid-cols-3 gap-4 mt-10">
                <img
                  src={`${API_URL}/images/all/factory1.webp`}
                  alt="Производство"
                  className="rounded-xl shadow-lg object-cover h-36 w-full"
                />
                <img
                  src={`${API_URL}/images/all/factory2.webp`}
                  alt="Сборка"
                  className="rounded-xl shadow-lg object-cover h-36 w-full"
                />
                <img
                  src={`${API_URL}/images/all/factory3.webp`}
                  alt="Конвейер"
                  className="rounded-xl shadow-lg object-cover h-36 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* НИЖНЯЯ ЧАСТЬ — ТЁМНЫЙ ФУТЕР */}
      <div className="bg-[#0F172A] text-white py-12">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

            {/* ЛОГОТИП */}
            <div className="flex items-center">
              <img
                src={`${API_URL}/images/icons/logo-footer.svg`}
                alt="Golden Soft"
                className="h-14"
              />
            </div>

            {/* НАВИГАЦИЯ */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Навигация</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-[#4295E4] transition">Главная</a></li>
                <li><a href="#" className="hover:text-[#4295E4] transition">Каталог</a></li>
                <li><a href="#" className="hover:text-[#4295E4] transition">Оптовая продажа</a></li>
                <li><a href="#" className="hover:text-[#4295E4] transition">О нас</a></li>
              </ul>
            </div>

            {/* КОНТАКТЫ */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Наши Контакты</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div>
                  <p className="font-medium text-white">Телефоны</p>
                  <p>+7 (988) 565 00 38</p>
                  <p>+375 33 662 82 56</p>
                </div>
                <div>
                  <p className="font-medium text-white">Email</p>
                  <p>vladpertcev@mail.ru</p>
                  <p>korobko416@gmail.com</p>
                </div>
              </div>
            </div>

            {/* АДРЕС */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Наш Адрес</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Россия,<br />
                Ростов-на-Дону ул. Богачева, 16
              </p>
            </div>

            {/* ИНФОРМАЦИЯ */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Информация</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-[#4295E4] transition">Доставка и оплата</a></li>
                <li><a href="#" className="hover:text-[#4295E4] transition">Гарантии</a></li>
                <li><a href="#" className="hover:text-[#4295E4] transition">Возврат товара</a></li>
              </ul>
            </div>
          </div>

          {/* КОПИРАЙТ */}
          <div className="mt-10 pt-8 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-500">
              © 2021 Golden Soft. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AboutFooter;