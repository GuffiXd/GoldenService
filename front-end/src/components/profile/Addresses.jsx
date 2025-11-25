// src/components/profile/Addresses.jsx
import React, { useState, useEffect } from "react";
import api from "../../config/api"; // Используем axios инстанс с токеном
import { MapPin, Plus, Trash2, Home, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "Дом",
    city: "",
    address: "",
    apartment: "",
    entrance: "",
    floor: "",
    intercom: "",
    comment: "",
    isDefault: false,
  });

  // Загрузка адресов
  const fetchAddresses = async () => {
    try {
      const res = await api.get("/api/addresses");
      setAddresses(res.data);
    } catch (err) {
      toast.error("Не удалось загрузить адреса");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Обработка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/addresses", formData);
      toast.success("Адрес добавлен");
      setFormData({
        title: "Дом",
        city: "",
        address: "",
        apartment: "",
        entrance: "",
        floor: "",
        intercom: "",
        comment: "",
        isDefault: false,
      });
      setShowModal(false);
      fetchAddresses(); // Обновляем список
    } catch (err) {
      toast.error("Ошибка при добавлении адреса");
    } finally {
      setSubmitting(false);
    }
  };

  // Удаление адреса
  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить адрес?")) return;
    try {
      await api.delete(`/api/addresses/${id}`);
      toast.success("Адрес удален");
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      toast.error("Ошибка при удалении");
    }
  };

  if (loading) return <div className="text-center py-20">Загрузка адресов...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Адреса доставки ({addresses.length})</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl mb-4">У вас пока нет сохраненных адресов</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-indigo-600 font-bold hover:underline"
          >
            Добавить первый адрес
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-6 rounded-3xl border-2 transition-all ${
                addr.isDefault
                  ? "border-indigo-600 bg-indigo-50 shadow-lg"
                  : "border-transparent bg-white shadow hover:shadow-lg"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${addr.isDefault ? "bg-indigo-200" : "bg-gray-100"}`}>
                    {addr.title === "Работа" || addr.title === "Офис" ? (
                      <Briefcase className={`w-6 h-6 ${addr.isDefault ? "text-indigo-700" : "text-gray-600"}`} />
                    ) : (
                      <Home className={`w-6 h-6 ${addr.isDefault ? "text-indigo-700" : "text-gray-600"}`} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{addr.title}</h3>
                    {addr.isDefault && <span className="text-xs text-indigo-600 font-bold uppercase">Основной</span>}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-800 font-medium mb-2">{addr.city ? `${addr.city}, ` : ''}{addr.address}</p>
              <div className="text-sm text-gray-500 space-y-1">
                {addr.apartment && <p>Кв./Офис: {addr.apartment}</p>}
                {(addr.entrance || addr.floor || addr.intercom) && (
                  <p>
                    {addr.entrance && `Подъезд: ${addr.entrance} • `}
                    {addr.floor && `Этаж: ${addr.floor} • `}
                    {addr.intercom && `Домофон: ${addr.intercom}`}
                  </p>
                )}
                {addr.comment && <p className="italic mt-2">"{addr.comment}"</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
            <div className="p-8 border-b">
              <h3 className="text-2xl font-bold">Новый адрес</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                <select
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Дом">Дом</option>
                  <option value="Работа">Работа</option>
                  <option value="Родители">Родители</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Город*</label>
                <input
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Москва"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Адрес (улица, дом)*</label>
                <input
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="ул. Ленина, д. 10"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Квартира</label>
                  <input
                    value={formData.apartment}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Этаж</label>
                  <input
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Подъезд</label>
                  <input
                    value={formData.entrance}
                    onChange={(e) => setFormData({ ...formData, entrance: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Домофон</label>
                  <input
                    value={formData.intercom}
                    onChange={(e) => setFormData({ ...formData, intercom: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий курьеру</label>
                <textarea
                  rows="2"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="isDefault" className="text-gray-700">Сделать основным адресом</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-bold transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
                >
                  {submitting ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}