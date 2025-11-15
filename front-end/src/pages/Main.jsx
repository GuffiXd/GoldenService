// src/pages/Main.jsx
import React from 'react';
import Header from '../components/Header';
import PromoBanner from '../components/PromoBanner';
import Promocode from '../components/Promocode';
import Footer from '../components/Footer';
import WhyUs from "../components/WhyUs"
import Statistics from '../components/Statistics';
import CategoriesSection from '../components/CategoriesSection';
import PopularProducts from '../components/PopularProducts';

function Main() {
  return (
    <div>
      <Promocode />
      <Header />
      <PromoBanner />
      <Statistics />
      <WhyUs />
      <CategoriesSection />
      <PopularProducts />
      <Footer />
    </div>
  );
}

export default Main;