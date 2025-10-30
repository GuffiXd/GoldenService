import React from "react";

function Footer() {
  return (
    <div className="flex flex-col">
      {/* Верхняя часть с формой обратного звонка */}
      <div className="w-full bg-[#F2F8FF] py-16 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold mb-4">Мы вам перезвоним</h1>
        <h2 className="max-w-[600px] text-gray-700 mb-10 px-4">
          Если у вас возникли какие-то вопросы или проблемы, заполните форму и
          мы Вам перезвоним.
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            className="bg-[#161C2400] border border-gray-300 px-4 w-[240px] h-[50px] rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Ваше имя"
          />
          <input
            className="bg-[#161C2400] border border-gray-300 px-4 w-[240px] h-[50px] rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Ваш Email"
          />
          <button className="bg-[#4295E4] text-white font-semibold rounded-md w-[240px] h-[50px] hover:bg-[#2f7acc] transition">
            Отправить
          </button>
        </div>
      </div>

      {/* Нижняя часть — можно под контакты, копирайт и т.д. */}
      <div className="w-full bg-[#0D2436] text-white py-10 flex flex-col md:flex-row items-center justify-between px-8 md:px-24">
        
      </div>
    </div>
  );
}

export default Footer;
