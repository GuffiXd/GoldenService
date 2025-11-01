import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import AddToCartBtn from "./AddToCartBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:5000";

function Slider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/locks/slider`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSlides(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки слайдера:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (swiperRef.current?.params?.navigation) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, [slides]);

  if (loading) return <div className="text-center py-10">Загрузка...</div>;
  if (slides.length === 0)
    return <div className="text-center py-10">Нет акций</div>;

  return (
    <div className="relative max-w-[1440px] mx-auto">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".swiper-pagination" }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="mySwiper"
      >
        {slides.map((lock) => (
          <SwiperSlide
            key={lock.id}
            className="flex flex-col md:flex-row items-center justify-between p-4 bg-white"
          >
            <div className="md:w-1/2">
              <img
                src={`${API_URL}${lock.image_path}`}
                alt={lock.name}
                className="w-full object-cover rounded-2xl h-full"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h1 className="text-[44px] font-bold mb-4">{lock.name}</h1>
              <p className="text-lg mb-2">
                {lock.description || "Надёжный и стильный замок."}
              </p>
              <p className="text-lg mb-2">
                Подходит для деревянных и межкомнатных дверей.
              </p>
              <p className="text-lg font-semibold mt-4">Цена</p>
              <p className="text-xl mb-4">
                {lock.price_with_discount}₽{" "}
                <span className="line-through text-gray-500">
                  {lock.price}₽
                </span>
              </p>
              <AddToCartBtn productId={lock.id} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* <div className="flex items-center justify-center gap-20 mt-6">
        <button ref={prevRef} className="hover:text-gray-600 transition " aria-label="Previous">
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </button>
        <div className="swiper-pagination"></div>
        <button ref={nextRef} className="hover:text-gray-600 transition" aria-label="Next">
          <FontAwesomeIcon icon={faChevronRight} size="lg" />
        </button>
      </div> */}

      <div className="flex items-center justify-center mt-6 mb-6 space-x-4">
        {/* Левая стрелка */}
        <button
          ref={prevRef}
          className="flex items-center justify-center w-6 h-6 hover:text-gray-600 transition-all duration-200"
          aria-label="Предыдущий слайд"
        >
          <FontAwesomeIcon icon={faChevronLeft} size="xl" />
        </button>

        {/* Пагинация */}
        <div className="flex items-center justify-center">
          <div className="swiper-pagination !static" />
        </div>

        {/* Правая стрелка */}
        <button
          ref={nextRef}
          className="flex items-center justify-center w-6 h-6 hover:text-gray-600 transition-all duration-200"
          aria-label="Следующий слайд"
        >
          <FontAwesomeIcon icon={faChevronRight} size="xl" />
        </button>
      </div>
    </div>
  );
}

export default Slider;
