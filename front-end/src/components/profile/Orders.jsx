// src/components/profile/Orders.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";

const API_URL = "http://localhost:5000";

const statusConfig = {
  новый: { color: "bg-blue-100 text-blue-800", icon: Clock },
  "в процессе": { color: "bg-yellow-100 text-yellow-800", icon: Package },
  "в обработке": { color: "bg-indigo-100 text-indigo-800", icon: Package },
  завершен: { color: "bg-emerald-100 text-emerald-800", icon: CheckCircle },
  отменен: { color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/user/${user.id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Ошибка загрузки");
        const data = await res.json();
        console.log("ЗАКАЗЫ:", data); // ← оставь, чтобы видеть структуру
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchOrders();
  }, [user?.id]);

  if (loading) return <div className="py-20 text-center">Загрузка заказов...</div>;
  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-24 h-24 mx-auto mb-6 text-gray-300" />
        <p className="text-2xl mb-4">У вас пока нет заказов</p>
        <Link to="/catalog" className="text-indigo-600 font-bold text-lg hover:underline">
          Перейти в каталог →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">Мои заказы ({orders.length})</h2>

      {orders.map((order) => {
        const items = order.items || []; // ← ВОТ ОНИ! Именно items!
        const StatusIcon = statusConfig[order.status]?.icon || Package;
        const statusStyle = statusConfig[order.status]?.color || "bg-gray-100 text-gray-800";

        return (
          <div key={order.id} className="bg-white rounded-3xl shadow-xl border overflow-hidden">
            {/* Шапка */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">Заказ №{order.id}</p>
                  <p className="text-2xl font-black">
                    {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-5 py-3 rounded-full font-bold flex items-center gap-2 ${statusStyle}`}>
                    <StatusIcon className="w-5 h-5" />
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  {order.status === "завершен" && <Truck className="w-10 h-10 text-emerald-600" />}
                </div>
              </div>
            </div>

            {/* Инфо */}
            <div className="p-8 grid md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-gray-600 text-sm">Товаров</p>
                <p className="text-4xl font-black text-indigo-600">{items.length}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Оплата</p>
                <p className="text-2xl font-bold">{order.payment_method}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Сумма</p>
                <p className="text-5xl font-black text-indigo-600">
                  {Number(order.total_price).toLocaleString("ru-RU")} ₽
                </p>
              </div>
            </div>

            {/* ТОВАРЫ — ВОТ ОНИ! */}
            <div className="border-t bg-gray-50 p-8">
              <h3 className="text-xl font-bold mb-6">Товары в заказе:</h3>
              <div className="space-y-6">
                {items.map((item) => {
                  const orderItem = item.OrderItem; // ← вот где количество и цена!
                  return (
                    <div key={item.id} className="flex items-center gap-6 bg-white rounded-2xl p-6 shadow-lg">
                      <img
                        src={`${API_URL}${item.image_path}`}
                        alt={item.name}
                        className="w-24 h-24 rounded-xl object-cover"
                        onError={(e) => (e.target.src = "/placeholder.jpg")}
                      />
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Артикул: {item.article}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {orderItem.quantity} × {Number(orderItem.price_at_purchase).toLocaleString()} ₽
                        </p>
                        <p className="text-2xl font-bold text-indigo-600">
                          {(orderItem.quantity * orderItem.price_at_purchase).toLocaleString()} ₽
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}