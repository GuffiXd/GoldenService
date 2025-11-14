import React from "react";

const API_URL = "http://localhost:5000";

function WhyChooseUs() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5 11V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2z" />
        </svg>
      ),
      title: "Возврат удвоенной стоимости",
      description: "За каждый отправленный товар который окажется бракованным, мы вернем вам двойную стоимость.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Монтаж",
      description: "Проводим монтажные работы любой сложности и в любое удобное для Вас время",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
      title: "Брендирование продукта",
      description: "Мы нанесем Ваш логотип любой сложности на свою продукцию, чтобы прибавить ей эксклюзивности",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-left mb-12">
          Почему стоит выбрать нас
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Левая часть — картинка */}
          <div className="relative rounded-xl overflow-hidden shadow-xl">
            <img
              src={`${API_URL}/images/wholesale-images/WhyChooseUs.webp`}
              alt="Деловое рукопожатие"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>

          {/* Правая часть — список */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                {/* Иконка */}
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-[#4295E4] rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>

                {/* Текст */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;