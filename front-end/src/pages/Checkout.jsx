// src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/useAuth";
import api from "../config/api";
import toast from "react-hot-toast";
import { ArrowLeft, Package, Truck, CreditCard, Home, Wrench, Settings } from "lucide-react";

const API_URL = "http://localhost:5000";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Форма
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    deliveryMethod: "cdek",
    paymentMethod: "online",
    comment: "",
    needInstallation: false,
    needSetup: false,
    promo: "",
  });

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await api.get("/api/addresses");
        setAddresses(res.data);
        const defaultAddr = res.data.find(a => a.isDefault) || res.data[0];
        setSelectedAddress(defaultAddr);
      } catch (err) {
        console.error("Ошибка загрузки адресов", err);
        toast.error("Не удалось загрузить адреса");
      }
    };
    loadAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      return toast.error("Укажите адрес доставки");
    }
    if (!selectedAddress.address) {
      return toast.error("Укажите полный адрес доставки, включая улицу");
    }
    // Note: If backend still requires city, re-add: if (!selectedAddress.city) { return toast.error("Укажите город в адресе"); }

    setIsSubmitting(true);

    try {
      const deliveryLabel = {
        cdek: "СДЭК",
        pochta: "Почта России",
        delivery: "Деловые линии"
      }[form.deliveryMethod] || "СДЭК";

      const orderData = {
        items: cart.map(item => ({
          id: item.id,  // Reverted to 'id' as in original code; adjust if backend uses 'product_id'
          quantity: item.quantity,
        })),
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        email: form.email,
        delivery_method: deliveryLabel,
        payment_method: form.paymentMethod === "online" ? "Карта онлайн" : "Оплата при получении",
        address: `${selectedAddress.city || ''}, ${selectedAddress.address}`,
        city: selectedAddress.city || '',
        postcode: selectedAddress?.postcode || "",
        country: "Россия",
        comment: [
          form.comment,
          form.needInstallation ? "Требуется установка" : "",
          form.needSetup ? "Требуется настройка софта" : "",
        ].filter(Boolean).join(" • "),
        promo: form.promo || "",
        total_price: totalPrice
      };

      console.log("Order data being sent:", orderData);  // Added for debugging payload
      const res = await api.post("/api/orders", orderData);

      if (res.data.success) {
        clearCart();
        toast.success("Заказ успешно оформлен!");
        navigate("/profile/orders");
      }
    } catch (err) {
      console.error("Full error response:", err.response);
      if (err.response?.data?.message) {
        console.error("Backend error message:", err.response.data.message);  // Log exact message
      }
      toast.error(err.response?.data?.message || "Ошибка оформления заказа");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center">
        <h1 className="text-4xl font-bold">Корзина пуста</h1>
        <Link to="/catalog" className="mt-6 inline-block text-indigo-600 hover:underline">
          ← Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8">
          <ArrowLeft className="w-5 h-5" /> Назад в корзину
        </Link>

        <h1 className="text-4xl font-black text-gray-900 mb-10">Оформление заказа</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Левая колонка — форма */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Контактные данные */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold mb-6">1. Контактные данные</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Фамилия"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Имя"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="tel"
                  placeholder="Телефон"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* 2. Доставка */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold mb-6">2. Доставка</h2>
              <div className="space-y-4">
                {["cdek", "pochta", "delivery"].map((method) => (
                  <label key={method} className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="delivery"
                      value={method}
                      checked={form.deliveryMethod === method}
                      onChange={(e) => setForm({ ...form, deliveryMethod: e.target.value })}
                      className="w-5 h-5 text-indigo-600"
                    />
                    <span className="flex-1">
                      {method === "cdek" && "СДЭК"}
                      {method === "pochta" && "Почта России"}
                      {method === "delivery" && "Деловые линии"}
                    </span>
                    <Package className="w-6 h-6 text-gray-400" />
                  </label>
                ))}
              </div>

              <div className="mt-6">
                <p className="font-semibold mb-3">Адрес доставки:</p>
                {addresses.length > 0 ? (
                  <select
                    className="w-full px-4 py-3 border rounded-xl"
                    onChange={(e) => {
                      const addr = addresses.find(a => a.id === +e.target.value);
                      setSelectedAddress(addr);
                    }}
                  >
                    {addresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.city ? `${addr.city}, ` : ''}{addr.address} {addr.isDefault && "(по умолчанию)"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-red-500">Добавьте адрес в профиле</p>
                )}
              </div>
            </div>

            {/* 3. Оплата */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold mb-6">3. Оплата</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={form.paymentMethod === "online"}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-5 h-5 text-indigo-600"
                  />
                  <span>Банковская карта</span>
                  <CreditCard className="w-6 h-6 text-gray-400" />
                </label>
                <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={form.paymentMethod === "cash"}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-5 h-5 text-indigo-600"
                  />
                  <span>Оплата при получении товара</span>
                </label>
              </div>

              <textarea
                placeholder="Комментарий"
                rows={3}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className="w-full mt-6 px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Правая колонка — итого */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-24 border">
              <h2 className="text-2xl font-bold mb-6">Итого</h2>

              {/* Товары */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={`${API_URL}${item.image_path}`}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      {item.name.includes("Подарок") && (
                        <p className="text-sm text-emerald-600">Подарок</p>
                      )}
                      <p className="text-sm text-gray-500">
                        {item.quantity} × {(item.price_with_discount || item.price).toLocaleString()} ₽
                      </p>
                    </div>
                    <p className="font-bold">
                      {((item.price_with_discount || item.price) * item.quantity).toLocaleString()} ₽
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span>К оплате:</span>
                  <span className="text-3xl font-black text-indigo-600">
                    {totalPrice.toLocaleString()} ₽
                  </span>
                </div>
              </div>

              {/* Доп. услуги */}
              <div className="mt-6 space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.needInstallation}
                    onChange={(e) => setForm({ ...form, needInstallation: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded"
                  />
                  <span>Нужна установка</span>
                  <Wrench className="w-5 h-5 text-gray-400" />
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.needSetup}
                    onChange={(e) => setForm({ ...form, needSetup: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded"
                  />
                  <span>Настройка софта</span>
                  <Settings className="w-5 h-5 text-gray-400" />
                </label>
              </div>

              {/* Промокод */}
              <div className="mt-6 flex gap-2">
                <input
                  type="text"
                  placeholder="Промокод"
                  value={form.promo}
                  onChange={(e) => setForm({ ...form, promo: e.target.value })}
                  className="flex-1 px-4 py-3 border rounded-xl"
                />
                <button className="px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
                  Добавить
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedAddress || !selectedAddress.address}
                className="w-full mt-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-2xl hover:shadow-xl transition disabled:opacity-50"
              >
                {isSubmitting ? "Оформляем..." : "Подтвердить заказ"}
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                Оформляя заказ, я принимаю условия пользовательского соглашения
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}