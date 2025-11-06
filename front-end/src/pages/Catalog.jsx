import React from 'react';
import Header from '../components/Header';
import Promocode from '../components/Promocode';
import Footer from '../components/Footer';
import CategoriesSection from '../components/CategoriesSection';

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