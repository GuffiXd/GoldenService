// src/components/profile/Addresses.jsx
export default function Addresses() {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Адреса доставки</h2>
        <div className="text-center py-20 text-gray-500">
          <p className="text-2xl mb-4">Адресов пока нет</p>
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition">
            + Добавить адрес
          </button>
        </div>
      </div>
    );
  }