import React from "react";

const API_URL = "http://localhost:5000";

function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white">
      {/* Верхняя часть — форма обратного звонка */}
      <div className="w-full bg-[#F2F8FF] py-16 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">Мы вам перезвоним</h1>
        <p className="max-w-[600px] text-gray-700 mb-10 px-4">
          Если у вас возникли какие-то вопросы или проблемы, заполните форму и мы Вам перезвоним.
        </p>

        <div className="flex flex-col md:flex-row gap-4 max-w-xl w-full px-4">
          <input
            className="bg-white border border-gray-300 px-4 w-full h-[50px] rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Ваше имя"
          />
          <input
            className="bg-white border border-gray-300 px-4 w-full h-[50px] rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            placeholder="Ваш Email"
          />
          <button className="bg-[#4295E4] text-white text-sm font-semibold rounded-md w-full md:w-[240px] h-[50px] hover:bg-[#2f7acc] transition">
            Отправить
          </button>
        </div>
      </div>

      {/* Нижняя часть — контакты */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="flex flex-wrap justify-between items-start gap-8">
          {/* Логотип */}
          <div>
            <img
              src={`${API_URL}/images/icons/logo-footer.svg`}
              alt="GoldenService"
              className="h-16"
            />
          </div>

          {/* Навигация */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Навигация</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition">Главная</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Каталог</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Оптовая продажа</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">О нас</a></li>
            </ul>
          </div>

          {/* Наши Контакты */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Наши Контакты</h3>
            <div className="space-y-3 text-gray-400">
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

          {/* Наш Адрес */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Наш Адрес</h3>
            <p className="text-gray-400">
              Россия,<br />
              Ростов-на-Дону ул. Богачева, 16
            </p>
          </div>

          {/* Информация */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Информация</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition">Доставка и оплата</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Гарантии</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Возврат товара</a></li>
            </ul>
          </div>
        </div>

        {/* Пустое место под соцсети + копирайт */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col justify-center items-center md:flex-row gap-4">
          <p className="text-sm text-gray-500">
            © 2021 Golden Soft All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;