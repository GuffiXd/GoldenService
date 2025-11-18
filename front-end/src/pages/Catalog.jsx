// src/pages/Catalog.jsx
import React, { useEffect } from "react";
import CatalogFilters from "../components/sections/CatalogFilters";
import CatalogProducts from "../components/sections/CatalogProducts";

export default function Catalog() {
  useEffect(() => {
    document.title = "Каталог умных замков — GoldenSoft";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/30">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
            ВСЕ УМНЫЕ ЗАМКИ
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Более 100 моделей с доставкой по всему миру
          </p>
        </div>
      </div>

      {/* Контент: фильтры слева + товары */}
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* ФИЛЬТРЫ — ПРИЖАТЫ СЛЕВА, БЕЗ ОТСТУПОВ */}
          <aside className="w-full lg:w-80 lg:min-w-80 lg:max-w-80 bg-white border-r border-gray-100 sticky top-0 h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-black text-gray-900 mb-8">Фильтры</h2>
              <CatalogFilters />
            </div>
          </aside>

          {/* ТОВАРЫ — ТОЧЬ-В-ТОЧЬ КАК В PopularProducts */}
          <div className="flex-1 p-6 lg:p-12">
            <CatalogProducts />
          </div>
        </div>
      </div>
    </div>
  );
}