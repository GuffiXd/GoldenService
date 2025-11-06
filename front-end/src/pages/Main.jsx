// src/pages/Main.jsx
import React from 'react';
import Header from '../components/Header';
import Slider from '../components/Slider';
import Promocode from '../components/Promocode';
import Footer from '../components/Footer';
import WhyUs from "../components/WhyUs"
import Statistics from '../components/Statistics';
import CategoriesMain from '../components/CategoriesMain';
import PopularProducts from '../components/PopularProducts';

function Main() {
  return (
    <div>
      <Promocode />
      <Header />
      <Slider />
      <Statistics />
      <WhyUs />
      <CategoriesMain />
      <PopularProducts />
      <Footer />
    </div>
  );
}

export default Main;