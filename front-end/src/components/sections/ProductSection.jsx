// src/components/sections/ProductSection.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Check,
  Shield,
  Truck,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

// ВНИМАНИЕ — ПРАВИЛЬНЫЕ ПУТИ К КОНТЕКСТАМ (подстраивай под свою структуру)
import { useAuth } from "../../context/useAuth";          // ← чаще всего так
import { useCart } from "../../context/CartContext";       // ← чаще всего так
// Если у тебя алиасы (@/context) — замени на:
// import { useAuth } from "@/context/useAuth";
// import { useCart } from "@/context/CartContext";

import toast from "react-hot-toast";
import api, { API_URL } from "../../config/api";

// ──────────────────────────────────────────────────────────────

const formatPrice = (value) =>
  value ? Number(value).toLocaleString("ru-RU") : "—";

const StarRating = ({ rating = 5 }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

export default function ProductSection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("specs");

  // ───── Загрузка товара ─────
  useEffect(() => {
    api
      .get(`/api/locks/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // ───── Избранное ─────
  useEffect(() => {
    if (!user || !product) return;
    api
      .get("/api/favorites")
      .then((res) =>
        setInWishlist(res.data.some((f) => String(f.id) === String(product.id)))
      )
      .catch(() => {});
  }, [user, product]);

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Войдите в аккаунт");
      navigate("/auth");
      return;
    }
    const prev = inWishlist;
    setInWishlist(!prev);
    try {
      prev
        ? await api.delete(`/api/favorites/${product.id}`)
        : await api.post(`/api/favorites/${product.id}`);
      toast.success(prev ? "Удалено из избранного" : "Добавлено в избранное");
    } catch {
      setInWishlist(prev);
    }
  };

  // ───── Лоадеры и ошибки ─────
  if (loading)
    return (
      <div className="py-32 flex justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!product)
    return (
      <div className="py-32 text-center">
        <p className="text-3xl font-bold mb-4">Товар не найден</p>
        <Link to="/catalog" className="text-indigo-600 hover:underline">
          ← Вернуться в каталог
        </Link>
      </div>
    );

  // ───── Данные ─────
  const currentPrice =
    Number(product.price_with_discount) || Number(product.price);
  const oldPrice = product.price_with_discount ? Number(product.price) : null;
  const totalPrice = currentPrice * quantity;
  const reviews = product.reviews || [];

  // Галерея
  const parseGallery = () => {
    if (!product.image_gallery) return [];
    try {
      return JSON.parse(product.image_gallery);
    } catch {
      return [];
    }
  };
  const thumbnails = [product.image_path, ...parseGallery()].filter(Boolean);

  // Способы разблокировки
  const unlockingMethods = Array.isArray(product.unlocking_methods)
    ? product.unlocking_methods
    : JSON.parse(product.unlocking_methods || "[]");

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-indigo-50 via-white to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Хлебные крошки */}
        <nav className="text-sm text-gray-600 mb-8 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-indigo-600 transition">Главная</Link>
          <span>→</span>
          <Link to="/catalog" className="hover:text-indigo-600 transition">Каталог</Link>
          <span>→</span>
          <span className="text-indigo-600 font-medium">{product.name}</span>
        </nav>

        {/* Основная часть */}
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">

          {/* Галерея */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-3xl blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
              <img
                src={`${API_URL}${thumbnails[selectedImage] || product.image_path}`}
                alt={product.name}
                className="w-full h-[400px] md:h-[550px] object-contain rounded-3xl shadow-2xl bg-white p-4"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-bold text-indigo-600">HIT</span>
              </div>
            </div>

            {thumbnails.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {thumbnails.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`rounded-2xl overflow-hidden border-2 transition-all h-24 ${
                      selectedImage === i
                        ? "border-indigo-600 ring-2 ring-indigo-600/30 scale-105"
                        : "border-transparent hover:border-indigo-300"
                    }`}
                  >
                    <img src={`${API_URL}${img}`} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Информация и покупка */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 mt-3">Артикул: {product.article}</p>
              <div className="flex items-center gap-4 mt-4">
                <StarRating rating={5} />
                <span className="text-gray-500 text-sm">({reviews.length} отзывов)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-6">
              <span className="text-5xl font-black text-indigo-600">
                {formatPrice(currentPrice)} ₽
              </span>
              {oldPrice && (
                <>
                  <del className="text-2xl text-gray-400">{formatPrice(oldPrice)} ₽</del>
                  <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    SALE
                  </span>
                </>
              )}
            </div>

            {/* Количество */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 max-w-md">
              <p className="font-bold text-gray-700 mb-3">Количество:</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 transition"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 transition"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Итого:</p>
                  <p className="text-2xl font-black text-indigo-600">
                    {formatPrice(totalPrice)} ₽
                  </p>
                </div>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  addToCart(product, quantity); // ← ПРАВИЛЬНОЕ ДОБАВЛЕНИЕ С КОЛИЧЕСТВОМ
                  toast.success(
                    quantity > 1
                      ? `Добавлено ${quantity} шт. в корзину`
                      : "Добавлено в корзину"
                  );
                }}
                className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30 flex justify-center items-center gap-2 transform active:scale-95"
              >
                <ShoppingCart className="w-6 h-6" />
                Добавить в корзину
              </button>

              <button
                onClick={toggleWishlist}
                className={`p-4 rounded-xl border-2 transition-all transform active:scale-95 ${
                  inWishlist
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-gray-200 hover:border-red-300 text-gray-400 hover:text-red-500"
                }`}
              >
                <Heart className={`w-8 h-8 ${inWishlist ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Гарантии */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <Check className="text-emerald-500 w-6 h-6" />
                <span className="text-sm font-medium">В наличии</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <Truck className="text-blue-500 w-6 h-6" />
                <span className="text-sm font-medium">Быстрая доставка</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <Shield className="text-purple-500 w-6 h-6" />
                <span className="text-sm font-medium">
                  Гарантия {product.warranty || "3 года"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ───── НИЖНЯЯ ЧАСТЬ (вкладки + характеристики как на скриншоте) ───── */}
        <div className="mt-20">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Вкладки */}
            <div className="flex border-b border-gray-200">
              {[
                { id: "specs", label: "Характеристики" },
                { id: "description", label: "Описание" },
                { id: "reviews", label: "Отзывы" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-5 text-lg font-bold transition-colors ${
                    activeTab === tab.id
                      ? "text-indigo-600 border-b-4 border-indigo-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8 md:p-12">

              {/* ХАРАКТЕРИСТИКИ */}
              {activeTab === "specs" && (
                <div className="grid lg:grid-cols-2 gap-12 text-lg">
                  <div className="space-y-6">
                    {unlockingMethods.length > 0 && (
                      <div className="flex justify-between py-4 border-b border-gray-100">
                        <span className="text-gray-600">Разблокировка</span>
                        <span className="font-medium text-right max-w-xs">
                          {unlockingMethods.join(", ")}
                          {product.face_id && !unlockingMethods.includes("Лицо") && ", Лицо"}
                        </span>
                      </div>
                    )}
                    {product.app_support && (
                      <div className="flex justify-between py-4 border-b border-gray-100">
                        <span className="text-gray-600">Приложение</span>
                        <span className="font-medium">Есть</span>
                      </div>
                    )}
                    {product.material && (
                      <div className="flex justify-between py-4 border-b border-gray-100">
                        <span className="text-gray-600">Материал</span>
                        <span className="font-medium">{product.material}</span>
                      </div>
                    )}
                    {product.color && (
                      <div className="flex justify-between py-4 border-b border-gray-100">
                        <span className="text-gray-600">Цвет</span>
                        <span className="font-medium">{product.color}</span>
                      </div>
                    )}
                    {product.battery_life && (
                      <div className="flex justify-between py-4 border-b border-gray-100">
                        <span className="text-gray-600">Питание</span>
                        <span className="font-medium">{product.battery_life}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {product.door_type && (
                      <div className="flex justify-between py-4 border-b border-gray-100">
                        <span className="text-gray-600">Тип двери</span>
                        <span className="font-medium">{product.door_type}</span>
                      </div>
                    )}
                    {product.door_thickness && (
                      <div className="flex justify-between py-4 border-b border-gray-100">
                        <span className="text-gray-600">Толщина двери</span>
                        <span className="font-medium">{product.door_thickness}</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex justify-between py-4 border-b border-gray-100">
                        <span className="text-gray-600">Размеры</span>
                        <span className="font-medium">{product.dimensions}</span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex justify-between py-4 border-b border-gray-100">
                        <span className="text-gray-600">Вес</span>
                        <span className="font-medium">{product.weight}</span>
                      </div>
                    )}
                    {product.waterproof && (
                      <div className="flex justify-between py-4 border-b border-gray-100">
                        <span className="text-gray-600">Влагозащита</span>
                        <span className="font-medium">{product.waterproof}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ОПИСАНИЕ */}
              {activeTab === "description" && (
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {product.description ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.description.replace(/\n/g, "<br />"),
                      }}
                    />
                  ) : (
                    <p className="text-gray-500 italic text-center py-12">
                      {product.short_description || "Описание отсутствует"}
                    </p>
                  )}
                </div>
              )}

              {/* ОТЗЫВЫ */}
              {activeTab === "reviews" && (
                <div className="space-y-8">
                  {reviews.length === 0 ? (
                    <p className="text-center text-gray-500 py-16 text-xl">
                      Отзывов пока нет. Будьте первым!
                    </p>
                  ) : (
                    reviews.map((review, i) => (
                      <div key={i} className="bg-gray-50 rounded-2xl p-8">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-bold">{review.author || "Аноним"}</p>
                              <StarRating rating={review.rating || 5} />
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.text}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}