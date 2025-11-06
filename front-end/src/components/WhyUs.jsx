import React from "react";

const API_URL = "http://localhost:5000";

function WhyUs() {
  const items = [
    {
      img: "/images/icons/korobka.jpg",
      title: "Возврат стоимости каждого замка в случае брака",
    },
    {
      img: "/images/icons/good.jpg",
      title: "Наносим ваш логотип компании на наш продукт",
    },
    {
      img: "/images/icons/korobka.jpg",
      title: "Только качественный и проверенный товар",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Заголовок */}
        <h1 className="text-center text-[44px] font-medium text-gray-900 mb-12">
          Почему GoldenService?
        </h1>

        {/* Блоки */}
        <div className="flex justify-center items-start gap-20">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center max-w-xs ${
                // Бордеры:
                index === 0
                  ? "border-r-2 border-l-2 pl-10 pr-10"           // Левый — только справа
                  : index === 1
                  ? "border-l-2 border-r-2 pl-10 pr-10"  // Средний — с двух сторон
                  : "border-l-2 border-r-2 pr-10 pl-10"           // Правый — только слева
              } border-gray-200`}
            >
              <div className="mb-6">
                <img
                  src={`${API_URL}${item.img}`}
                  alt=""
                  className="w-20 h-20 object-contain"
                />
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyUs;