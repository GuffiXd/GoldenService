import React, { useEffect, useState } from "react";
import api, { API_URL } from "../../config/api";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faCheck, faTimes, faBox } from "@fortawesome/free-solid-svg-icons";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/api/admin/orders");
      setOrders(data);
    } catch (error) {
      toast.error("Ошибка загрузки заказов");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      console.log('Обновление статуса:', orderId, newStatus);
      const response = await api.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      console.log('Ответ сервера:', response.data);
      toast.success("Статус заказа обновлен");
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
      toast.error(error.response?.data?.error || "Ошибка обновления статуса");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот заказ?")) return;

    try {
      await api.delete(`/api/admin/orders/${orderId}`);
      toast.success("Заказ успешно удален");
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        handleCloseModal();
      }
    } catch (error) {
      toast.error("Ошибка удаления заказа");
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Ожидает";
      case "processing":
        return "В обработке";
      case "shipped":
        return "Отправлен";
      case "delivered":
        return "Доставлен";
      case "cancelled":
        return "Отменен";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Загрузка заказов...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Управление заказами</h1>
        <p className="text-gray-600 mt-2">Всего заказов: {orders.length}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID заказа
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Покупатель
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Заказов пока нет
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{order.user_name || "Гость"}</div>
                      <div className="text-sm text-gray-500">{order.user_email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      {order.total_price?.toLocaleString()} ₽
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Просмотр"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Удалить"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Заказ #{selectedOrder.id}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Покупатель</h3>
                    <p className="text-gray-900 font-semibold">{selectedOrder.user_name || "Гость"}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.user_email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Дата заказа</h3>
                    <p className="text-gray-900">
                      {new Date(selectedOrder.created_at).toLocaleString("ru-RU")}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Статус</h3>
                    <span
                      className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Общая сумма</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedOrder.total_price?.toLocaleString()} ₽
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBox} />
                  Товары в заказе
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      {item.image_path && (
                        <img
                          src={`${API_URL}${item.image_path}`}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-600">
                          {item.price?.toLocaleString()} ₽ × {item.quantity} шт
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">
                        {(item.price * item.quantity)?.toLocaleString()} ₽
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Адрес доставки</h3>
                  <p className="text-gray-700">{selectedOrder.shipping_address}</p>
                </div>
              )}

              {/* Status Actions */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Изменить статус</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "pending")}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold hover:bg-yellow-200 transition"
                  >
                    Ожидает
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "processing")}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold hover:bg-blue-200 transition"
                  >
                    В обработке
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "shipped")}
                    className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-semibold hover:bg-purple-200 transition"
                  >
                    Отправлен
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "delivered")}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold hover:bg-green-200 transition"
                  >
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Доставлен
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled")}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-semibold hover:bg-red-200 transition"
                  >
                    Отменен
                  </button>
                </div>
              </div>

              {/* Delete Order */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Удалить заказ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
