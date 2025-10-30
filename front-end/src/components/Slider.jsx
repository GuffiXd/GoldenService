// src/components/Slider.jsx
import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import AddToCartBtn from "./AddToCartBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

function Slider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (
      swiperRef.current &&
      swiperRef.current.params &&
      swiperRef.current.params.navigation
    ) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <div className="relative max-w-[1440px] mx-auto">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        loop={true} // бесконечный цикл
        autoplay={{
          delay: 5000, // каждые 5 секунд
          disableOnInteraction: false, // не останавливать при клике
        }}
        pagination={{ clickable: true, el: ".swiper-pagination" }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="mySwiper"
      >
        <SwiperSlide className="flex flex-col md:flex-row items-center justify-between p-4 bg-white">
          <div className="md:w-1/2">
            <img
              src="/slider2.jpg"
              alt="Slide 1"
              className="w-full object-cover rounded-2xl"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-[44px] font-bold mb-4">
              Golden Soft GS-200Z-5 для офиса
            </h1>
            <p className="text-lg mb-2">
              Замок дверной электронный Golden Soft GS-200Z-5 имеет роскошный
              глянцевый блеск, четкие линии, красивые формы.
            </p>
            <p className="text-lg mb-2">
              Подходит для установки на деревянную/межкомнатную дверь.
            </p>
            <p className="text-lg font-semibold mt-4">Цена</p>
            <p className="text-xl mb-4">
              33 000₽{" "}
              <span className="line-through text-gray-500">37 000₽</span>
            </p>
            <AddToCartBtn />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <img
            src="/image2.jpg"
            alt="Slide 2"
            className="w-full h-[500px] object-cover rounded-2xl"
          />
        </SwiperSlide>

        <SwiperSlide>
          <img
            src="/image3.jpg"
            alt="Slide 3"
            className="w-full h-[500px] object-cover rounded-2xl"
          />
        </SwiperSlide>
      </Swiper>

      {/* Навигация */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          ref={prevRef}
          className="mr-4 hover:text-gray-600 transition"
          aria-label="Previous slide"
        >
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </button>

        <div className="swiper-pagination flex justify-center"></div>

        <button
          ref={nextRef}
          className="ml-4 hover:text-gray-600 transition"
          aria-label="Next slide"
        >
          <FontAwesomeIcon icon={faChevronRight} size="lg" />
        </button>
      </div>
    </div>
  );
}

export default Slider;
