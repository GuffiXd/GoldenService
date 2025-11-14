import React from "react";

const API_URL = "http://localhost:5000";

function HowWeWork() {
  const steps = [
    {
      number: "1",
      title: "Оформление заявки",
      description:
        "Вы оставляете заявку на сайте или связываетесь с нами по указанному на сайте номеру телефона",
      image: "/images/wholesale-images/HowWeWork1.webp",
    },
    {
      number: "2",
      title: "Согласование",
      description:
        "Мы консультируем Вас, согласовываем стоимость и точное время приезда нашего специалиста",
      image: "/images/wholesale-images/HowWeWork2.webp",
    },
    {
      number: "3",
      title: "Отправка товара и установка",
      description:
        "Наш специалист по монтажу замков выезжает к Вам в точно назначенное время по согласованному адресу",
      image: "/images/wholesale-images/HowWeWork3.webp",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
          Как мы работаем
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center group"
            >
              <div className="relative w-full h-64 mb-6  rounded-lg shadow-md">
                <img
                  src={`${API_URL}${step.image}`}
                  alt={step.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/images/fallback.webp"; // fallback
                  }}
                />
                <div className="absolute -top-3 right-1 w-12 h-12 bg-[#4295E4] text-white font-bold text-xl flex items-center justify-center">
                  {step.number}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowWeWork;