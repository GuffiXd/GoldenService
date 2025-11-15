import React from 'react';
import Header from '../components/layout/Header';
import Promocode from '../components/layout/Promocode';
import Footer from '../components/layout/Footer';
import CategoriesSection from '../components/sections/CategoriesSection';

function Catalog() {
  return (
    <div>
      <Promocode />
      <Header />
      <CategoriesSection />
      <Footer />
    </div>
  );
}

export default Catalog;