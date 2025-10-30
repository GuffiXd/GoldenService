import React from "react";

function Promocode() {
  return (
    <div className="bg-[#454F5B] w-full h-[44px] text-white flex items-center justify-between px-6 text-base md:text-xl">
      {/* Центральный текст (выровнен по центру экрана) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <p>Скидка 10% по промокоду “ZAMOK” на все заказы до 10.09</p>
      </div>

      {/* Правый текст */}
      <div className="ml-auto cursor-pointer hover:underline">
        <p>Обратный звонок</p>
      </div>
    </div>
  );
}

export default Promocode;
