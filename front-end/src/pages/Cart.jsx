// src/pages/Cart.jsx
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";

const API_URL = "http://localhost:5000";

export default function Cart() {
  const { user, loading } = useAuth();
  const { cart, removeFromCart, updateQuantity, totalPrice } =
    useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { state: { from: "/cart" } });
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="py-32 text-center">Загрузка...</div>;
  if (!user) return null;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <h1 className="text-4xl font-black text-gray-900">
            Ваша корзина пуста
          </h1>
          <p className="text-xl text-gray-500 max-w-md mx-auto">
            Похоже, вы еще не добавили товары. Перейдите в каталог, чтобы найти
            что-то особенное.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-black text-gray-900 mb-10">Корзина</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Список товаров */}
          <div className="flex-1 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={`${API_URL}${item.image_path}`}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Артикул: {item.article}
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-black text-indigo-600">
                      {Number(
                        item.price_with_discount || item.price
                      ).toLocaleString()}{" "}
                      ₽
                    </p>
                    {item.price_with_discount && (
                      <p className="text-sm text-gray-400 line-through">
                        {Number(item.price).toLocaleString()} ₽
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 shadow-sm transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 shadow-sm transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Итого и оформление */}
          <div className="lg:w-96">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-24 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Сумма заказа
              </h2>

              <div className="space-y-4 mb-8 border-b border-gray-100 pb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Товары ({cart.length})</span>
                  <span>{totalPrice.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Доставка</span>
                  <span className="text-emerald-600 font-medium">
                    Бесплатно
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-bold text-gray-900">Итого:</span>
                <span className="text-4xl font-black text-indigo-600">
                  {totalPrice.toLocaleString()} ₽
                </span>
              </div>
              <Link to="/checkout">
                <button
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition shadow-indigo-500/30"
                >
                  Оформить заказ
                </button>
              </Link>

              <p className="text-xs text-gray-400 text-center mt-4">
                Нажимая кнопку, вы соглашаетесь с условиями обработки данных
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}