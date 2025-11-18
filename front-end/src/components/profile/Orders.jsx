// src/components/profile/Orders.jsx
export default function Orders() {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Мои заказы</h2>
        <div className="text-center py-20 text-gray-500">
          <p className="text-2xl mb-4">У вас пока нет заказов</p>
          <button className="text-indigo-600 font-bold text-lg hover:underline">
            Перейти в каталог →
          </button>
        </div>
      </div>
    );
  }